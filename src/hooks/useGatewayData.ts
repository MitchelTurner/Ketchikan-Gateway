import { useCallback, useEffect, useMemo, useState } from 'react'
import { predictDowntownPassengers } from '../lib/prediction'
import { loadShipVisits } from '../lib/ships'
import { crowdFromPassengers } from '../lib/utils'
import { fetchWeatherForecast, seasonalWeather } from '../lib/weather'
import type { DayForecast, DayWeather, ShipVisit } from '../types'

function dayPassengers(ships: ShipVisit[]): number {
  const actual = ships.reduce((s, v) => s + (v.actual_passengers || 0), 0)
  if (actual > 0) return actual
  return ships.reduce((s, v) => s + (v.estimated_passengers || 0), 0)
}

export function useGatewayData() {
  const [visits, setVisits] = useState<ShipVisit[]>([])
  const [weather, setWeather] = useState<Map<string, DayWeather>>(new Map())
  const [source, setSource] = useState<'pocketbase' | 'local'>('local')
  const [weatherLive, setWeatherLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [shipsResult, weatherResult] = await Promise.allSettled([
        loadShipVisits(),
        fetchWeatherForecast(16),
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
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
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
      const sorted = [...ships].sort((a, b) => a.arrival.localeCompare(b.arrival))
      const scheduledPassengers = dayPassengers(sorted)
      const wx = weather.get(date) ?? seasonalWeather(date)
      const predictedDowntown = predictDowntownPassengers(
        scheduledPassengers,
        wx.ashoreFactor,
      )
      result.push({
        date,
        ships: sorted,
        scheduledPassengers,
        predictedDowntown,
        crowdLevel: crowdFromPassengers(scheduledPassengers, sorted.length),
        weatherAdjustedCrowd: crowdFromPassengers(predictedDowntown, sorted.length),
        weather: wx,
      })
    }
    return result.sort((a, b) => a.date.localeCompare(b.date))
  }, [visits, weather])

  const byDate = useMemo(() => {
    const m = new Map<string, DayForecast>()
    for (const d of days) m.set(d.date, d)
    return m
  }, [days])

  const getDay = useCallback(
    (date: string): DayForecast => {
      return (
        byDate.get(date) ?? {
          date,
          ships: [],
          scheduledPassengers: 0,
          predictedDowntown: 0,
          crowdLevel: 'low',
          weatherAdjustedCrowd: 'low',
          weather: weather.get(date) ?? seasonalWeather(date),
        }
      )
    },
    [byDate, weather],
  )

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
    refetch: load,
  }
}
