import type { DayWeather, HourlyWeatherPoint } from '../types'
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

interface OpenMeteoHourly {
  time: string[]
  weather_code: number[]
  temperature_2m: number[]
  precipitation: number[]
  precipitation_probability: number[]
  windspeed_10m: number[]
}

export async function fetchWeatherForecast(days = 16): Promise<Map<string, DayWeather>> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(LAT))
  url.searchParams.set('longitude', String(LON))
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max',
  )
  url.searchParams.set(
    'hourly',
    'weather_code,temperature_2m,precipitation,precipitation_probability,windspeed_10m',
  )
  url.searchParams.set('timezone', 'America/Juneau')
  url.searchParams.set('forecast_days', String(Math.min(days, 16)))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Weather API ${res.status}`)
  const json = (await res.json()) as {
    daily: OpenMeteoDaily
    hourly: OpenMeteoHourly
  }

  const hourlyByDate = new Map<string, HourlyWeatherPoint[]>()
  const h = json.hourly
  for (let i = 0; i < h.time.length; i++) {
    const iso = h.time[i]
    const [date, time] = iso.split('T')
    const hour = Number((time ?? '00:00').slice(0, 2))
    const condition = wmoToCondition(h.weather_code[i] ?? 3)
    const precipMm = h.precipitation[i] ?? 0
    const precipProbability = h.precipitation_probability[i] ?? 0
    const point: HourlyWeatherPoint = {
      time: iso,
      hour,
      condition,
      tempF: cToF(h.temperature_2m[i] ?? 15),
      precipMm,
      precipProbability,
      windMph: kmhToMph(h.windspeed_10m[i] ?? 10),
      ashoreFactor: ashoreFactor(condition, precipMm, precipProbability),
    }
    const list = hourlyByDate.get(date) ?? []
    list.push(point)
    hourlyByDate.set(date, list)
  }

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
      hourly: hourlyByDate.get(d.time[i]) ?? [],
    })
  }

  return map
}

/** Seasonal fallback when live weather is unavailable */
export function seasonalWeather(date: string): DayWeather {
  const month = Number(date.split('-')[1])
  const seed = [...date].reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseTemp =
    ({ 5: 52, 6: 56, 7: 59, 8: 58, 9: 54 }[month] ?? 55) + (seed % 13) - 6
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
  const factor = ashoreFactor(condition, precipMm, 50)

  const hourly: HourlyWeatherPoint[] = []
  for (let hour = 0; hour < 24; hour++) {
    const hourPrecip =
      condition.includes('rain') || condition === 'storm'
        ? precipMm / 10 + ((seed + hour) % 5) * 0.1
        : 0
    hourly.push({
      time: `${date}T${String(hour).padStart(2, '0')}:00`,
      hour,
      condition,
      tempF: baseTemp + (hour > 10 && hour < 16 ? 3 : -1),
      precipMm: hourPrecip,
      precipProbability:
        condition.includes('rain') || condition === 'storm' ? 70 : 30,
      windMph: condition === 'storm' ? 25 : condition === 'heavy-rain' ? 15 : 8,
      ashoreFactor: ashoreFactor(condition, hourPrecip, 50),
    })
  }

  return {
    date,
    condition,
    tempHighF: baseTemp + 3,
    tempLowF: baseTemp - 3,
    precipitationMm: precipMm,
    precipProbability:
      condition.includes('rain') || condition === 'storm' ? 70 : 30,
    windMph: condition === 'storm' ? 25 : condition === 'heavy-rain' ? 15 : 8,
    ashoreFactor: factor,
    hourly,
  }
}
