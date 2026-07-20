import type { CrowdLevel, WeatherCondition } from '../types'

/** Alaska local calendar date YYYY-MM-DD */
export function todayInAlaska(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Anchorage' })
}

/** Current hour in Alaska (0–23). Uses hourCycle — Number(toLocaleString) is flaky. */
export function currentAlaskaHour(): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Anchorage',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const raw = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  if (!Number.isFinite(raw)) return 0
  // Some engines emit 24 for midnight
  return raw === 24 ? 0 : raw
}

export function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatMonthYear(year: number, monthIndex: string | number): string {
  const d = new Date(year, Number(monthIndex), 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function firstWeekday(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay()
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function cToF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371)
}

/** Map WMO weather codes to app conditions */
export function wmoToCondition(code: number): WeatherCondition {
  if (code === 0) return 'sunny'
  if (code <= 2) return 'partly-cloudy'
  if (code === 3) return 'cloudy'
  if (code <= 51 || code === 56) return 'light-rain'
  if (code <= 61 || code === 66 || code === 80) return 'rain'
  if (code <= 67 || code === 81 || code === 82) return 'heavy-rain'
  if (code >= 95) return 'storm'
  if (code >= 71 && code <= 77) return 'cloudy' // snow rare in summer season
  return 'cloudy'
}

export function crowdFromPassengers(passengers: number, shipCount: number): CrowdLevel {
  if (passengers > 0) {
    if (passengers <= 3000) return 'low'
    if (passengers <= 6000) return 'moderate'
    if (passengers <= 10000) return 'busy'
    return 'extreme'
  }
  if (shipCount === 0) return 'low'
  if (shipCount <= 1) return 'moderate'
  if (shipCount <= 3) return 'busy'
  return 'extreme'
}

export const CROWD_META: Record<
  CrowdLevel,
  { label: string; message: string; tone: string }
> = {
  low: {
    label: 'Low',
    message: 'Town will feel open — a good day to explore downtown.',
    tone: 'calm',
  },
  moderate: {
    label: 'Moderate',
    message: 'Some visitors ashore. Most spots stay manageable.',
    tone: 'steady',
  },
  busy: {
    label: 'Busy',
    message: 'Heavy foot traffic downtown. Aim for early or late windows.',
    tone: 'alert',
  },
  extreme: {
    label: 'Extreme',
    message: 'Peak capacity. Avoid downtown roughly 9 AM–3 PM.',
    tone: 'critical',
  },
}

export const WEATHER_META: Record<
  WeatherCondition,
  { label: string; crowdEffect: string }
> = {
  sunny: {
    label: 'Sunny',
    crowdEffect: 'Clear skies pull more passengers ashore.',
  },
  'partly-cloudy': {
    label: 'Partly cloudy',
    crowdEffect: 'Typical shoreline traffic expected.',
  },
  cloudy: {
    label: 'Overcast',
    crowdEffect: 'Slightly fewer outdoor visitors.',
  },
  'light-rain': {
    label: 'Light rain',
    crowdEffect: 'Some guests stay aboard — a softer downtown.',
  },
  rain: {
    label: 'Rain',
    crowdEffect: 'Noticeably thinner crowds on the waterfront.',
  },
  'heavy-rain': {
    label: 'Heavy rain',
    crowdEffect: 'Many tourists stay on ship. Town can feel empty.',
  },
  storm: {
    label: 'Stormy',
    crowdEffect: 'Minimal foot traffic; some excursions may cancel.',
  },
}
