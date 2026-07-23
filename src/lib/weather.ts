import type { DayWeather, HourlyWeatherPoint, WeatherCondition } from '../types'
import { ashoreFactor } from './prediction'
import { cToF, kmhToMph, refineDayCondition, wmoToCondition } from './utils'

const LAT = 55.3422
const LON = -131.6461
/** Match app calendar dates (`todayInAlaska` uses Anchorage). */
const TZ = 'America/Anchorage'

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

/**
 * Live Open-Meteo forecast + recent past days so the month calendar
 * does not fall back to seasonal weather for earlier in the month.
 */
export async function fetchWeatherForecast(
  forecastDays = 16,
  pastDays = 40,
): Promise<Map<string, DayWeather>> {
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
  url.searchParams.set('timezone', TZ)
  url.searchParams.set('forecast_days', String(Math.min(forecastDays, 16)))
  url.searchParams.set('past_days', String(Math.min(Math.max(pastDays, 0), 92)))

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
    const date = d.time[i]
    const code = d.weather_code[i] ?? 3
    const precipMm = d.precipitation_sum[i] ?? 0
    const precipProbability = d.precipitation_probability_max[i] ?? 0
    const hourly = hourlyByDate.get(date) ?? []
    const daytime = hourly
      .filter((p) => p.hour >= 8 && p.hour <= 18)
      .map((p) => p.condition)
    const condition = refineDayCondition(code, precipMm, daytime)

    map.set(date, {
      date,
      condition,
      tempHighF: cToF(d.temperature_2m_max[i] ?? 15),
      tempLowF: cToF(d.temperature_2m_min[i] ?? 10),
      precipitationMm: precipMm,
      precipProbability,
      windMph: kmhToMph(d.windspeed_10m_max[i] ?? 10),
      ashoreFactor: ashoreFactor(condition, precipMm, precipProbability),
      hourly,
    })
  }

  return map
}

/** Deterministic 0–99 roll from date (avoids char-sum clustering on ISO dates). */
function dateRoll(date: string): number {
  let h = 2166136261
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % 100
}

/**
 * Climate-ish condition mix by month for Southeast Alaska.
 * July/August are the relatively drier cruise months — not storm-heavy.
 */
function seasonalCondition(month: number, roll: number): WeatherCondition {
  // Weights: sunny, partly, cloudy, light-rain, rain, heavy-rain, storm (cumulative)
  const table: Record<number, number[]> = {
    //            sun  pc   cld  lr   rain  heavy storm
    5: /* May */ [12, 28, 45, 65, 85, 96, 100],
    6: /* Jun */ [18, 38, 55, 72, 88, 96, 100],
    7: /* Jul */ [22, 45, 62, 78, 90, 97, 100],
    8: /* Aug */ [16, 36, 54, 72, 88, 96, 100],
    9: /* Sep */ [10, 24, 42, 62, 82, 94, 100],
  }
  const cuts = table[month] ?? [12, 30, 50, 68, 85, 95, 100]
  const labels: WeatherCondition[] = [
    'sunny',
    'partly-cloudy',
    'cloudy',
    'light-rain',
    'rain',
    'heavy-rain',
    'storm',
  ]
  for (let i = 0; i < cuts.length; i++) {
    if (roll < cuts[i]) return labels[i]
  }
  return 'cloudy'
}

/** Seasonal fallback when live weather is unavailable or outside the fetch window */
export function seasonalWeather(date: string): DayWeather {
  const month = Number(date.split('-')[1])
  const roll = dateRoll(date)
  const baseTemp =
    ({ 5: 52, 6: 56, 7: 59, 8: 58, 9: 54 }[month] ?? 55) + (roll % 13) - 6
  const condition = seasonalCondition(month, roll)
  const precipBy = {
    sunny: 0,
    'partly-cloudy': roll % 3 === 0 ? 0.2 : 0,
    cloudy: (roll % 4) * 0.4,
    'light-rain': 1.5 + (roll % 6),
    rain: 6 + (roll % 12),
    'heavy-rain': 16 + (roll % 16),
    storm: 28 + (roll % 20),
  } as const
  const precipMm = precipBy[condition]
  const factor = ashoreFactor(condition, precipMm, 50)

  const hourly: HourlyWeatherPoint[] = []
  for (let hour = 0; hour < 24; hour++) {
    const hourPrecip =
      condition.includes('rain') || condition === 'storm'
        ? precipMm / 10 + ((roll + hour) % 5) * 0.1
        : 0
    hourly.push({
      time: `${date}T${String(hour).padStart(2, '0')}:00`,
      hour,
      condition,
      tempF: baseTemp + (hour > 10 && hour < 16 ? 3 : -1),
      precipMm: hourPrecip,
      precipProbability:
        condition.includes('rain') || condition === 'storm' ? 70 : 25,
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
      condition.includes('rain') || condition === 'storm' ? 70 : 25,
    windMph: condition === 'storm' ? 25 : condition === 'heavy-rain' ? 15 : 8,
    ashoreFactor: factor,
    hourly,
  }
}
