import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  accuracyStats,
  calibrationBiasFromLog,
  syncForecastToLog,
} from '../lib/accuracy'
import { maybeNotifyForDay } from '../lib/notifications'
import { buildDayForecast, emptyDay } from '../lib/prediction'
import { loadShipVisits } from '../lib/ships'
import { addDays, todayInAlaska } from '../lib/utils'
import { fetchWeatherForecast, seasonalWeather } from '../lib/weather'
import type { DayForecast, DayWeather, ShipVisit } from '../types'

const REFRESH_MS = 10 * 60 * 1000

export function useGatewayData() {
  const [visits, setVisits] = useState<ShipVisit[]>([])
  const [weather, setWeather] = useState<Map<string, DayWeather>>(new Map())
  const [source, setSource] = useState<'pocketbase' | 'local'>('local')
  const [weatherLive, setWeatherLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [calibrationBias, setCalibrationBias] = useState(1)
  const [accuracy, setAccuracy] = useState(accuracyStats())

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true)
    setError(null)
    try {
      const [shipsResult, weatherResult] = await Promise.allSettled([
        loadShipVisits(),
        // 16-day forecast + ~40 past days so month calendars use live data
        fetchWeatherForecast(16, 40),
      ])

      if (shipsResult.status === 'fulfilled') {
        setVisits(shipsResult.value.visits)
        setSource(shipsResult.value.source)
      } else {
        setError('Could not load ship schedule.')
      }

      if (weatherResult.status === 'fulfilled') {
        setWeather(weatherResult.value)
        setWeatherLive(true)
      } else {
        setWeatherLive(false)
      }

      setCalibrationBias(calibrationBiasFromLog())
      setAccuracy(accuracyStats())
      setLastUpdated(new Date())
    } finally {
      if (!opts?.silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const id = window.setInterval(() => {
      void load({ silent: true })
    }, REFRESH_MS)
    return () => window.clearInterval(id)
  }, [load])

  const days = useMemo(() => {
    const byDate = new Map<string, ShipVisit[]>()
    for (const v of visits) {
      const list = byDate.get(v.date) ?? []
      list.push(v)
      byDate.set(v.date, list)
    }

    const result: DayForecast[] = []
    for (const [date, ships] of byDate) {
      const wx = weather.get(date) ?? seasonalWeather(date)
      result.push(buildDayForecast(date, ships, wx, calibrationBias))
    }
    return result.sort((a, b) => a.date.localeCompare(b.date))
  }, [visits, weather, calibrationBias])

  const byDate = useMemo(() => {
    const m = new Map<string, DayForecast>()
    for (const d of days) m.set(d.date, d)
    return m
  }, [days])

  const getDay = useCallback(
    (date: string): DayForecast => {
      return (
        byDate.get(date) ??
        emptyDay(date, weather.get(date) ?? seasonalWeather(date))
      )
    },
    [byDate, weather],
  )

  // Log + notify for today when data settles
  useEffect(() => {
    if (loading) return
    const todayIso = todayInAlaska()
    const today = getDay(todayIso)
    const tomorrow = getDay(addDays(todayIso, 1))
    syncForecastToLog(today)
    maybeNotifyForDay(today, tomorrow)
    setAccuracy(accuracyStats())
  }, [loading, getDay, days])

  const seasonStats = useMemo(() => {
    if (days.length === 0) return null
    const totalPax = days.reduce((s, d) => s + d.scheduledPassengers, 0)
    const busiest = days.reduce((a, b) =>
      b.scheduledPassengers > a.scheduledPassengers ? b : a,
    )
    return {
      totalPassengers: totalPax,
      totalShipDays: days.filter((d) => d.ships.length > 0).length,
      totalVisits: visits.length,
      extremeDays: days.filter((d) => d.crowdLevel === 'extreme').length,
      busyDays: days.filter((d) => d.crowdLevel === 'busy').length,
      busiestDay: busiest,
      rainReliefDays: days.filter((d) => d.rainRelief >= 1500 && d.dropsCrowdBand)
        .length,
    }
  }, [days, visits.length])

  return {
    days,
    getDay,
    loading,
    error,
    source,
    weatherLive,
    seasonStats,
    lastUpdated,
    calibrationBias,
    accuracy,
    refetch: () => load(),
  }
}
