import type {
  CrowdLevel,
  DayForecast,
  DayWeather,
  DowntownVerdict,
  HourlyCrowdPoint,
  HourlyWeatherPoint,
  ShipVisit,
  WeatherCondition,
} from '../types'
import { crowdFromPassengers, WEATHER_META } from './utils'

/**
 * Share of scheduled cruise capacity expected ashore given weather.
 * Rain is Ketchikan's crowd-thinner — wet days keep guests on ships
 * and cancel outdoor excursions.
 */
const ASHORE_BY_CONDITION: Record<WeatherCondition, number> = {
  sunny: 0.95,
  'partly-cloudy': 0.9,
  cloudy: 0.85,
  'light-rain': 0.72,
  rain: 0.58,
  'heavy-rain': 0.42,
  storm: 0.3,
}

export function ashoreFactor(
  condition: WeatherCondition,
  precipMm: number,
  precipProbability: number,
): number {
  let factor = ASHORE_BY_CONDITION[condition]

  if (precipMm >= 15) factor -= 0.08
  else if (precipMm >= 8) factor -= 0.04

  if (precipProbability >= 80 && condition === 'partly-cloudy') factor -= 0.06
  if (precipProbability >= 90 && condition === 'cloudy') factor -= 0.08

  return Math.min(0.98, Math.max(0.25, factor))
}

/** Mega-ships densify downtown more; expedition ships less so. */
export function shipSizeWeight(capacity: number): number {
  if (capacity >= 3500) return 1.08
  if (capacity >= 2000) return 1.0
  if (capacity >= 500) return 0.92
  return 0.75
}

/** Downtown berths 1–4 full impact; anchorage / unknown slightly less. */
export function berthWeight(berth: string): number {
  const b = berth.trim().toUpperCase()
  if (['1', '2', '3', '4', 'I', 'II', 'III', 'IV'].includes(b)) return 1.0
  if (!b || b === '0' || b.includes('ANCH') || b.includes('FLOAT')) return 0.85
  return 0.95
}

export function shipCapacity(ship: ShipVisit): number {
  return ship.actual_passengers > 0
    ? ship.actual_passengers
    : ship.estimated_passengers || 0
}

export function weightedShipPassengers(ship: ShipVisit): number {
  const cap = shipCapacity(ship)
  return Math.round(cap * shipSizeWeight(cap) * berthWeight(ship.berth))
}

export function sumScheduled(ships: ShipVisit[]): number {
  return ships.reduce((s, v) => s + shipCapacity(v), 0)
}

export function sumWeighted(ships: ShipVisit[]): number {
  return ships.reduce((s, v) => s + weightedShipPassengers(v), 0)
}

export function sumActuals(ships: ShipVisit[]): number {
  return ships.reduce((s, v) => s + (v.actual_passengers || 0), 0)
}

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h)) return 8
  return h + (m >= 30 ? 0.5 : 0)
}

/**
 * Fraction of a ship's passengers expected ashore at a given hour.
 * Ramp up after arrival, peak mid-call, ramp down before departure.
 */
export function shipAshoreFraction(
  hour: number,
  arrival: string,
  departure: string,
): number {
  const arr = parseHour(arrival)
  const dep = parseHour(departure)
  if (hour < arr || hour >= dep) return 0

  const duration = Math.max(dep - arr, 1)
  const elapsed = hour - arr
  const remaining = dep - hour

  // First ~1.5h: disembarking
  if (elapsed < 1.5) return 0.35 + (elapsed / 1.5) * 0.4
  // Last ~1.5h: reboarding
  if (remaining < 1.5) return 0.35 + (remaining / 1.5) * 0.4
  // Mid-call peak share of that ship's guests ashore
  return Math.min(0.85, 0.55 + Math.min(duration / 12, 0.25))
}

function hourLabel(hour: number): string {
  const h = Math.floor(hour)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const display = h % 12 === 0 ? 12 : h % 12
  return `${display}${suffix}`
}

export function buildHourlyCrowd(
  ships: ShipVisit[],
  dayWeather: DayWeather,
  calibrationBias = 1,
): HourlyCrowdPoint[] {
  const hourlyMap = new Map<number, HourlyWeatherPoint>()
  for (const h of dayWeather.hourly ?? []) {
    hourlyMap.set(h.hour, h)
  }

  const points: HourlyCrowdPoint[] = []
  for (let hour = 5; hour <= 20; hour++) {
    let passengers = 0
    let shipsInPort = 0
    for (const ship of ships) {
      const frac = shipAshoreFraction(hour, ship.arrival, ship.departure)
      if (frac <= 0) continue
      shipsInPort += 1
      passengers += weightedShipPassengers(ship) * frac
    }

    const hx = hourlyMap.get(hour)
    const factor = (hx?.ashoreFactor ?? dayWeather.ashoreFactor) * calibrationBias
    const condition = hx?.condition ?? dayWeather.condition
    const precipMm = hx?.precipMm ?? 0

    points.push({
      hour,
      label: hourLabel(hour),
      passengers: Math.round(passengers * factor),
      shipsInPort,
      precipMm,
      condition,
    })
  }
  return points
}

export function downtownVerdict(
  level: CrowdLevel,
  peakHour: number | null,
): { verdict: DowntownVerdict; label: string; detail: string } {
  if (level === 'low' || level === 'moderate') {
    return {
      verdict: 'quiet',
      label: 'Quiet',
      detail:
        level === 'low'
          ? 'Downtown should feel open — a good day to run errands or explore.'
          : 'Manageable crowds. Most spots stay comfortable.',
    }
  }
  if (level === 'busy') {
    const window =
      peakHour != null
        ? `Peak around ${hourLabel(peakHour)}. `
        : 'Peak roughly 10 AM–2 PM. '
    return {
      verdict: 'okay',
      label: 'Okay — time it',
      detail: `${window}Fine early or after ships leave; midday waterfront will be heavy.`,
    }
  }
  return {
    verdict: 'avoid',
    label: 'Avoid 10–2',
    detail:
      peakHour != null
        ? `Extreme day. Peak near ${hourLabel(peakHour)} — skip downtown mid-day if you can.`
        : 'Extreme day. Skip downtown roughly 10 AM–2 PM if you can.',
  }
}

export function buildWhy(args: {
  shipCount: number
  scheduled: number
  predicted: number
  condition: WeatherCondition
  ashoreFactor: number
  peakHour: number | null
  calibrationBias: number
}): string {
  const parts = [
    `${args.shipCount} ship${args.shipCount === 1 ? '' : 's'}`,
    `${args.scheduled.toLocaleString()} scheduled`,
    `${WEATHER_META[args.condition].label.toLowerCase()}`,
    `~${Math.round(args.ashoreFactor * 100)}% ashore`,
  ]
  if (args.peakHour != null) {
    parts.push(`peak ${hourLabel(args.peakHour)}`)
  }
  if (Math.abs(args.calibrationBias - 1) > 0.02) {
    parts.push(`model tuned ×${args.calibrationBias.toFixed(2)}`)
  }
  return parts.join(' · ')
}

export function buildDayForecast(
  date: string,
  ships: ShipVisit[],
  weather: DayWeather,
  calibrationBias = 1,
): DayForecast {
  const sorted = [...ships].sort((a, b) => a.arrival.localeCompare(b.arrival))
  const scheduledPassengers = sumScheduled(sorted)
  const weightedScheduled = sumWeighted(sorted)
  const actualTotal = sumActuals(sorted)
  const hasActuals = sorted.some((s) => s.actual_passengers > 0)

  const effectiveFactor = Math.min(
    0.98,
    Math.max(0.25, weather.ashoreFactor * calibrationBias),
  )
  const predictedDowntown = Math.round(weightedScheduled * effectiveFactor)

  const crowdLevel = crowdFromPassengers(scheduledPassengers, sorted.length)
  const weatherAdjustedCrowd = crowdFromPassengers(
    predictedDowntown,
    sorted.length,
  )

  const hourlyCrowd = buildHourlyCrowd(sorted, weather, calibrationBias)
  const peak = hourlyCrowd.reduce(
    (best, p) => (p.passengers > best.passengers ? p : best),
    hourlyCrowd[0] ?? {
      hour: 12,
      label: '12PM',
      passengers: 0,
      shipsInPort: 0,
      precipMm: 0,
      condition: weather.condition,
    },
  )
  const peakHour = sorted.length > 0 ? peak.hour : null
  const peakPassengers = sorted.length > 0 ? peak.passengers : 0

  const clearFactor = ASHORE_BY_CONDITION.sunny
  const clearPredicted = Math.round(weightedScheduled * clearFactor * calibrationBias)
  const rainRelief = Math.max(0, clearPredicted - predictedDowntown)
  const dropsCrowdBand =
    crowdLevel !== weatherAdjustedCrowd &&
    (['busy', 'extreme'] as CrowdLevel[]).includes(crowdLevel)

  const { verdict, label, detail } = downtownVerdict(
    weatherAdjustedCrowd,
    peakHour,
  )

  return {
    date,
    ships: sorted,
    scheduledPassengers,
    weightedScheduled,
    predictedDowntown,
    crowdLevel,
    weatherAdjustedCrowd,
    weather,
    hourlyCrowd,
    peakHour,
    peakPassengers,
    rainRelief,
    dropsCrowdBand,
    verdict,
    verdictLabel: label,
    verdictDetail: detail,
    why: buildWhy({
      shipCount: sorted.length,
      scheduled: scheduledPassengers,
      predicted: predictedDowntown,
      condition: weather.condition,
      ashoreFactor: effectiveFactor,
      peakHour,
      calibrationBias,
    }),
    hasActuals,
    actualTotal,
  }
}

export function emptyDay(date: string, weather: DayWeather): DayForecast {
  return buildDayForecast(date, [], weather, 1)
}

/** Best clear window today: lowest precip among hours with moderate+ ship presence, or lowest precip overall midday. */
export function bestClearWindow(
  hourly: HourlyCrowdPoint[],
): { start: number; end: number; label: string } | null {
  if (hourly.length === 0) return null
  // Prefer hours 8–17 with lowest precip; look for contiguous dry stretch
  const dayHours = hourly.filter((h) => h.hour >= 8 && h.hour <= 17)
  if (dayHours.length === 0) return null

  let bestStart = dayHours[0].hour
  let bestLen = 1
  let bestPrecip = dayHours[0].precipMm
  let curStart = dayHours[0].hour
  let curLen = 1

  for (let i = 1; i < dayHours.length; i++) {
    const dry = dayHours[i].precipMm < 0.3
    const prevDry = dayHours[i - 1].precipMm < 0.3
    if (dry && prevDry && dayHours[i].hour === dayHours[i - 1].hour + 1) {
      curLen += 1
      if (
        curLen > bestLen ||
        (curLen === bestLen && dayHours[i].precipMm < bestPrecip)
      ) {
        bestLen = curLen
        bestStart = curStart
        bestPrecip = dayHours[i].precipMm
      }
    } else {
      curStart = dayHours[i].hour
      curLen = 1
      if (dry && bestLen === 1 && dayHours[i].precipMm < bestPrecip) {
        bestStart = curStart
        bestPrecip = dayHours[i].precipMm
      }
    }
  }

  const end = bestStart + bestLen - 1
  return {
    start: bestStart,
    end,
    label:
      bestLen > 1
        ? `${hourLabel(bestStart)}–${hourLabel(end + 1)}`
        : hourLabel(bestStart),
  }
}
