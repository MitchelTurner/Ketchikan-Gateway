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
    const arrive = parseHour(s.arrival)
    const depart = parseHour(s.departure)
    // Require a real call window — empty times must not match
    if (!s.arrival || !s.departure || depart <= arrive) return false
    return arrive <= hour && hour < depart
  })

  // If no ships are alongside, shore traffic is effectively empty for "right now"
  // (hourly curve can still show ramps before/after and must not drive the banner).
  const passengers = shipsNow.length === 0 ? 0 : (point?.passengers ?? 0)
  const level = crowdFromPassengers(passengers, shipsNow.length)

  return { hour, passengers, shipsNow, level, point }
}

function levelToVerdict(level: ReturnType<typeof crowdFromPassengers>): DowntownVerdict {
  if (level === 'extreme') return 'avoid'
  if (level === 'busy') return 'okay'
  return 'quiet'
}

/** Short answer for sticky bar / hero — based on ships in port right now. */
export function shouldGoDowntown(day: DayForecast): {
  verdict: DowntownVerdict
  label: string
  short: string
  detail: string
} {
  const snap = currentShoreSnapshot(day)
  const active = day.ships.filter((s) => !s.cancelled)
  const laterGetsBusy =
    day.verdict === 'okay' || day.verdict === 'avoid'

  if (active.length === 0 || snap.shipsNow.length === 0) {
    return {
      verdict: 'quiet',
      label: 'Quiet',
      short: 'Yes — go downtown',
      detail:
        active.length === 0
          ? 'Nothing on the schedule today.'
          : laterGetsBusy
            ? 'Clear right now. It may get busier later when calls overlap.'
            : 'Clear right now — good window.',
    }
  }

  const verdict = levelToVerdict(snap.level)

  if (verdict === 'avoid') {
    return {
      verdict,
      label: 'Avoid 10–2',
      short: 'No — skip downtown now',
      detail: `~${snap.passengers.toLocaleString()} ashore this hour with ${snap.shipsNow.length} ship${snap.shipsNow.length === 1 ? '' : 's'} alongside.`,
    }
  }

  if (verdict === 'okay') {
    return {
      verdict,
      label: 'Okay — time it',
      short: 'Maybe — time it carefully',
      detail: `Busy right now (~${snap.passengers.toLocaleString()} ashore). Quick stops are fine; skip lingering on Creek Street.`,
    }
  }

  return {
    verdict: 'quiet',
    label: 'Quiet',
    short: 'Yes — go downtown',
    detail: `Light traffic (~${snap.passengers.toLocaleString()} ashore) with ${snap.shipsNow.length} ship${snap.shipsNow.length === 1 ? '' : 's'} in. Good window.`,
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
  return `${day.date}: ${day.verdictLabel} — ~${day.predictedDowntown.toLocaleString()} predicted ashore${cancelled}.${windowHint}${rain} ktnport.com/schedule/${day.date}`
}
