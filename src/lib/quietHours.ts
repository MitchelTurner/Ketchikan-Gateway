import type { Activity, CrowdLevel, DayForecast, GoAdvice } from '../types'
import { currentAlaskaHour } from './utils'

export interface QuietSpot {
  id: string
  name: string
  band: string
  note: string
}

/** Signature spots with typical quiet windows vs cruise peaks. */
export const QUIET_SPOTS: QuietSpot[] = [
  {
    id: 'creek',
    name: 'Creek Street',
    band: 'Before 8 AM · after 4 PM',
    note: 'Peak cruise strip — avoid 10 AM–3 PM on busy days.',
  },
  {
    id: 'totem',
    name: 'Totem Bight',
    band: 'Before 9 AM · after 3 PM',
    note: 'Tour buses dominate late morning.',
  },
  {
    id: 'ward',
    name: 'Ward Lake',
    band: 'Any time',
    note: 'Off excursion routes — usually quiet even on extreme days.',
  },
  {
    id: 'rainbird',
    name: 'Rainbird Trail',
    band: 'Any time',
    note: 'Local trail near town; rarely packed.',
  },
  {
    id: 'saxman',
    name: 'Saxman Village',
    band: 'After 2 PM',
    note: 'Morning tour waves thin out in the afternoon.',
  },
]

export function goAdviceForActivity(
  activity: Activity,
  day: DayForecast,
): { advice: GoAdvice; label: string; detail: string } {
  const hour = currentAlaskaHour()
  const point = day.hourlyCrowd.find((h) => h.hour === Math.floor(hour))
  const pax = point?.passengers ?? day.predictedDowntown
  const level = day.weatherAdjustedCrowd

  if (activity.cruiseSensitivity === 'low') {
    return {
      advice: 'good-anytime',
      label: 'Good anytime',
      detail: 'Low cruise traffic here — go when it suits you.',
    }
  }

  const peakish =
    level === 'extreme' ||
    level === 'busy' ||
    pax >= 6000 ||
    (day.peakHour != null && Math.abs(hour - day.peakHour) <= 1)

  if (activity.cruiseSensitivity === 'high' && peakish && hour >= 9 && hour < 15) {
    return {
      advice: 'wait',
      label: 'Wait',
      detail: `Crowds are heavy now (~${pax.toLocaleString()} ashore). Try ${activity.quietHours}.`,
    }
  }

  if (hour < 9 || hour >= 15 || level === 'low' || level === 'moderate') {
    return {
      advice: 'go-now',
      label: 'Go now',
      detail: 'Solid window relative to today’s ship curve.',
    }
  }

  return {
    advice: 'wait',
    label: 'Wait if you can',
    detail: `Mid-day pressure. Quieter: ${activity.quietHours}.`,
  }
}

export function quietHoursForCrowd(level: CrowdLevel): QuietSpot[] {
  if (level === 'low' || level === 'moderate') return QUIET_SPOTS
  return QUIET_SPOTS
}
