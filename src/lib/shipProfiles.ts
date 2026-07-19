import type { ShipLineProfile } from '../types'

/** Infer line style from vessel name — affects downtown foot-traffic weight. */
export function inferLineProfile(shipName: string): ShipLineProfile {
  const s = shipName.toUpperCase()

  if (
    /SAFARI|WILDERNESS|UNCRUISE|NATIONAL GEOGRAPHIC|LINDBLAD|QUEST|ENDEAVOUR|DISCOVERER|LEGACY/.test(
      s,
    )
  ) {
    return 'expedition'
  }

  if (
    /NORWEGIAN|CARNIVAL|ROYAL|SYMPHONY|OVATION|QUANTUM|ANTHEM|ODYSSEY|ENCORE|BLISS|JOY|GETAWAY|BREAKAWAY|GEM|JEWEL|SPIRIT|MIRACLE|LUMINOSA/.test(
      s,
    )
  ) {
    return 'shopping'
  }

  if (
    /PRINCESS|HOLLAND|NOORDAM|KONINGSDAM|EURODAM|NIEUW|CELEBRITY|DISNEY|VIRGIN|MSC|AZAMARA|OCEAN/.test(
      s,
    )
  ) {
    return 'excursion'
  }

  return 'mixed'
}

export const LINE_PROFILE_META: Record<
  ShipLineProfile,
  { label: string; detail: string; downtownWeight: number }
> = {
  shopping: {
    label: 'Shopping-heavy',
    detail: 'More waterfront retail pressure downtown.',
    downtownWeight: 1.06,
  },
  excursion: {
    label: 'Excursion-heavy',
    detail: 'Guests spread to tours; downtown still busy mid-day.',
    downtownWeight: 0.94,
  },
  expedition: {
    label: 'Expedition',
    detail: 'Smaller footprint — light downtown impact.',
    downtownWeight: 0.72,
  },
  mixed: {
    label: 'Mixed',
    detail: 'Typical mix of shopping and tours.',
    downtownWeight: 1.0,
  },
}

export function lineProfileWeight(shipName: string): number {
  return LINE_PROFILE_META[inferLineProfile(shipName)].downtownWeight
}
