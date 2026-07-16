import type { DayWeather } from '../types'
import { ashoreFactor } from './prediction'
import { cToF, kmhToMph, wmoToCondition } from './utils'

const LAT = 55.3422
const LON = -131.6461

interface OpenMeteoDaily {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  windspeed_10m_max: number[]
}

export async function fetchWeatherForecast(days = 14): Promise<Map<string, DayWeather>> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(LAT))
  url.searchParams.set('longitude', String(LON))
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max',
  )
  url.searchParams.set('timezone', 'America/Juneau')
  url.searchParams.set('forecast_days', String(days))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Weather API ${res.status}`)
  const json = (await res.json()) as { daily: OpenMeteoDaily }
  const d = json.daily
  const map = new Map<string, DayWeather>()

  for (let i = 0; i < d.time.length; i++) {
    const condition = wmoToCondition(d.weather_code[i] ?? 3)
    const precipMm = d.precipitation_sum[i] ?? 0
    const precipProbability = d.precipitation_probability_max[i] ?? 0
    map.set(d.time[i], {
      date: d.time[i],
      condition,
      tempHighF: cToF(d.temperature_2m_max[i] ?? 15),
      tempLowF: cToF(d.temperature_2m_min[i] ?? 10),
      precipitationMm: precipMm,
      precipProbability,
      windMph: kmhToMph(d.windspeed_10m_max[i] ?? 10),
      ashoreFactor: ashoreFactor(condition, precipMm, precipProbability),
    })
  }

  return map
}

/** Seasonal fallback when live weather is unavailable */
export function seasonalWeather(date: string): DayWeather {
  const month = Number(date.split('-')[1])
  const seed = [...date].reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseTemp = ({ 5: 52, 6: 56, 7: 59, 8: 58, 9: 54 }[month] ?? 55) + (seed % 13) - 6
  const roll = seed % 100
  const condition =
    roll < 8
      ? 'sunny'
      : roll < 20
        ? 'partly-cloudy'
        : roll < 35
          ? 'cloudy'
          : roll < 55
            ? 'light-rain'
            : roll < 78
              ? 'rain'
              : roll < 93
                ? 'heavy-rain'
                : 'storm'
  const precipBy = {
    sunny: 0,
    'partly-cloudy': 0,
    cloudy: (seed % 3) * 0.5,
    'light-rain': 2 + (seed % 8),
    rain: 8 + (seed % 15),
    'heavy-rain': 20 + (seed % 20),
    storm: 30 + (seed % 25),
  } as const
  const precipMm = precipBy[condition]
  return {
    date,
    condition,
    tempHighF: baseTemp + 3,
    tempLowF: baseTemp - 3,
    precipitationMm: precipMm,
    precipProbability: condition.includes('rain') || condition === 'storm' ? 70 : 30,
    windMph: condition === 'storm' ? 25 : condition === 'heavy-rain' ? 15 : 8,
    ashoreFactor: ashoreFactor(condition, precipMm, 50),
  }
}
