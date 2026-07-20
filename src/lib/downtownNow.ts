import type { DayForecast, DowntownVerdict } from '../types'
import { currentAlaskaHour, crowdFromPassengers } from './utils'

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) + ((m || 0) >= 30 ? 0.5 : 0)
}

export function hourLabel(hour: number): string {
  const h = Math.floor(hour)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const display = h % 12 === 0 ? 12 : h % 12
  return `${display}${suffix}`
}

export function currentShoreSnapshot(day: DayForecast) {
  const hour = currentAlaskaHour()
  const point =
    day.hourlyCrowd.find((h) => h.hour === hour) ??
    day.hourlyCrowd.find((h) => h.hour === Math.floor(hour))

  const shipsNow = day.ships.filter((s) => {
    if (s.cancelled) return false
    return parseHour(s.arrival) <= hour && hour < parseHour(s.departure)
  })

  const passengers = point?.passengers ?? 0
  const level = crowdFromPassengers(passengers, shipsNow.length)

  return { hour, passengers, shipsNow, level, point }
}

/** Short answer for sticky bar / hero. */
export function shouldGoDowntown(day: DayForecast): {
  verdict: DowntownVerdict
  label: string
  short: string
  detail: string
} {
  const snap = currentShoreSnapshot(day)
  const active = day.ships.filter((s) => !s.cancelled)

  if (active.length === 0) {
    return {
      verdict: 'quiet',
      label: 'Quiet',
      short: 'Yes — go downtown',
      detail: 'No ships in the schedule. Town should feel open.',
    }
  }

  // Prefer live hour when ships are alongside; else day verdict
  const usingNow = snap.shipsNow.length > 0
  const verdict: DowntownVerdict = usingNow
    ? snap.level === 'extreme'
      ? 'avoid'
      : snap.level === 'busy'
        ? 'okay'
        : 'quiet'
    : day.verdict

  if (verdict === 'avoid') {
    return {
      verdict,
      label: 'Avoid 10–2',
      short: 'No — skip downtown now',
      detail: usingNow
        ? `~${snap.passengers.toLocaleString()} ashore this hour with ${snap.shipsNow.length} ship${snap.shipsNow.length === 1 ? '' : 's'} alongside.`
        : day.verdictDetail,
    }
  }

  if (verdict === 'okay') {
    return {
      verdict,
      label: 'Okay — time it',
      short: 'Maybe — time it carefully',
      detail: usingNow
        ? `Busy right now (~${snap.passengers.toLocaleString()} ashore). Quick stops are fine; skip lingering on Creek Street.`
        : day.verdictDetail,
    }
  }

  return {
    verdict: 'quiet',
    label: 'Quiet',
    short: 'Yes — go downtown',
    detail: usingNow
      ? `Light traffic (~${snap.passengers.toLocaleString()} ashore). Good window.`
      : day.verdictDetail,
  }
}

/** Weather vs ship-slate disagreement. */
export function weatherCrowdConflict(day: DayForecast): string | null {
  const cond = day.weather?.condition
  if (!cond) return null
  const wet =
    cond === 'rain' ||
    cond === 'heavy-rain' ||
    cond === 'storm' ||
    cond === 'light-rain'
  const clear = cond === 'sunny' || cond === 'partly-cloudy'

  if (clear && (day.crowdLevel === 'extreme' || day.crowdLevel === 'busy')) {
    if (day.weatherAdjustedCrowd === 'extreme' || day.weatherAdjustedCrowd === 'busy') {
      return `Clear skies + a ${day.crowdLevel} ship slate — expect full downtown pressure.`
    }
  }

  if (wet && (day.crowdLevel === 'busy' || day.crowdLevel === 'extreme')) {
    if (
      day.weatherAdjustedCrowd === 'low' ||
      day.weatherAdjustedCrowd === 'moderate' ||
      day.dropsCrowdBand
    ) {
      return `Wet weather is cutting a ${day.crowdLevel} schedule — paper looks busy, town may feel softer.`
    }
  }

  if (clear && day.rainRelief < 500 && day.crowdLevel === 'extreme') {
    return 'Sunny extreme day — weather won’t thin the crowds.'
  }

  return null
}

export function downtownTimeline(day: DayForecast): {
  firstArrival: string | null
  peak: string | null
  clearOut: string | null
} {
  const active = day.ships
    .filter((s) => !s.cancelled)
    .sort((a, b) => a.arrival.localeCompare(b.arrival))
  if (active.length === 0) {
    return { firstArrival: null, peak: null, clearOut: null }
  }
  const firstArrival = active[0].arrival
  const lastDepart = [...active].sort((a, b) =>
    a.departure.localeCompare(b.departure),
  )[active.length - 1].departure
  const peak =
    day.peakHour != null ? hourLabel(day.peakHour) : null
  return {
    firstArrival,
    peak,
    clearOut: lastDepart,
  }
}

export function facebookShareText(day: DayForecast): string {
  const rain =
    day.rainRelief >= 1200
      ? ` Rain relief: ~${day.rainRelief.toLocaleString()} fewer ashore than a clear day.`
      : ''
  const cancelled =
    day.cancelledCount > 0 ? ` (${day.cancelledCount} cancelled)` : ''
  const timeline = downtownTimeline(day)
  const windowHint = timeline.peak
    ? ` Peak around ${timeline.peak}.`
    : timeline.firstArrival
      ? ` First arrival ${timeline.firstArrival}.`
      : ''
  return `${day.date}: ${day.verdictLabel} — ~${day.predictedDowntown.toLocaleString()} predicted ashore${cancelled}.${windowHint}${rain} ktnport.com/day/${day.date}`
}
