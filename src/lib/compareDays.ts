import type { DayForecast } from '../types'
import { WEATHER_META } from './utils'

export function compareTomorrow(today: DayForecast, tomorrow: DayForecast): string {
  const crowdDelta = tomorrow.predictedDowntown - today.predictedDowntown
  const todayCond = today.weather ? WEATHER_META[today.weather.condition].label : 'unknown'
  const tomCond = tomorrow.weather
    ? WEATHER_META[tomorrow.weather.condition].label
    : 'unknown'

  const todayPrecip = today.weather?.precipitationMm ?? 0
  const tomPrecip = tomorrow.weather?.precipitationMm ?? 0
  const drier = tomPrecip < todayPrecip - 1
  const wetter = tomPrecip > todayPrecip + 1

  const quieter = crowdDelta < -1500
  const busier = crowdDelta > 1500

  if (today.ships.length === 0 && tomorrow.ships.length === 0) {
    return 'Tomorrow stays ship-free — another quiet day on the waterfront.'
  }

  const parts: string[] = []
  if (quieter) parts.push('quieter')
  else if (busier) parts.push('busier')
  else parts.push('similar crowds')

  if (drier) parts.push('drier')
  else if (wetter) parts.push('wetter')
  else if (todayCond !== tomCond) parts.push(tomCond.toLowerCase())

  const crowdBit =
    quieter || busier
      ? `${Math.abs(crowdDelta).toLocaleString()} ${quieter ? 'fewer' : 'more'} predicted ashore`
      : `${tomorrow.predictedDowntown.toLocaleString()} predicted ashore`

  return `Tomorrow is ${parts.join(' and ')} — ${crowdBit} (${tomCond}).`
}

export function predictionConfidence(day: DayForecast): {
  level: 'high' | 'medium' | 'low'
  label: string
  detail: string
} {
  const cond = day.weather?.condition ?? 'cloudy'
  const precip = day.weather?.precipitationMm ?? 0
  const ships = day.ships.length
  const mixedRain =
    cond === 'light-rain' ||
    cond === 'partly-cloudy' ||
    (precip > 0 && precip < 8 && cond !== 'sunny')

  if (day.hasActuals) {
    return {
      level: 'high',
      label: 'High confidence',
      detail: 'Confirmed actuals logged for this day.',
    }
  }

  if (
    (cond === 'sunny' || cond === 'partly-cloudy') &&
    precip < 2 &&
    ships <= 3
  ) {
    return {
      level: 'high',
      label: 'High confidence',
      detail: 'Clear weather and a simple ship slate.',
    }
  }

  if (mixedRain || ships >= 5 || cond === 'rain') {
    return {
      level: 'low',
      label: 'Lower confidence',
      detail: 'Mixed rain or a heavy ship day — ashore rates vary more.',
    }
  }

  return {
    level: 'medium',
    label: 'Medium confidence',
    detail: 'Typical conditions — treat the band as a guide.',
  }
}
