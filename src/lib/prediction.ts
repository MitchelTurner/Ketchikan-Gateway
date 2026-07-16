import type { WeatherCondition } from '../types'

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

  // Extra dampening for heavy measured precip
  if (precipMm >= 15) factor -= 0.08
  else if (precipMm >= 8) factor -= 0.04

  // High chance of rain even if WMO is mild
  if (precipProbability >= 80 && condition === 'partly-cloudy') factor -= 0.06
  if (precipProbability >= 90 && condition === 'cloudy') factor -= 0.08

  return Math.min(0.98, Math.max(0.25, factor))
}

export function predictDowntownPassengers(
  scheduled: number,
  factor: number,
): number {
  return Math.round(scheduled * factor)
}
