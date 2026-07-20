export type BerthPlace = {
  code: string
  name: string
  area: 'downtown' | 'ward-cove' | 'anchorage' | 'other'
  latitude: number
  longitude: number
  summary: string
}

/** Approximate berth / dock locations in Ketchikan. */
export const BERTH_PLACES: BerthPlace[] = [
  {
    code: '1',
    name: 'Berth 1 (downtown)',
    area: 'downtown',
    latitude: 55.3415,
    longitude: -131.6475,
    summary:
      'Closest downtown dock to Creek Street and the tourist core. Guests step almost directly into peak foot traffic.',
  },
  {
    code: '2',
    name: 'Berth 2 (downtown)',
    area: 'downtown',
    latitude: 55.3418,
    longitude: -131.6468,
    summary:
      'Central downtown berth. Heavy walk-off volume lands on Front Street within a few minutes.',
  },
  {
    code: '3',
    name: 'Berth 3 (downtown)',
    area: 'downtown',
    latitude: 55.3422,
    longitude: -131.6462,
    summary:
      'Downtown berth near the tunnel and main shopping strip. Overlaps with berths 1–2 amplify midday crowds.',
  },
  {
    code: '4',
    name: 'Berth 4 (downtown)',
    area: 'downtown',
    latitude: 55.3428,
    longitude: -131.6455,
    summary:
      'Northernmost of the classic downtown docks. Still walkable to the core; slightly easier egress north.',
  },
  {
    code: 'WW',
    name: 'Ward Cove West',
    area: 'ward-cove',
    latitude: 55.406,
    longitude: -131.725,
    summary:
      'North of town at Ward Cove. Guests typically use shuttles or tours — downtown still fills, but the waterfront spike is softer than a four-berth downtown day.',
  },
  {
    code: 'WE',
    name: 'Ward Cove East',
    area: 'ward-cove',
    latitude: 55.4055,
    longitude: -131.722,
    summary:
      'Ward Cove east dock. Same general pattern as WW: shuttle-dependent access, less walk-off density on Creek Street.',
  },
  {
    code: 'AN3',
    name: 'Anchorage (tender)',
    area: 'anchorage',
    latitude: 55.34,
    longitude: -131.65,
    summary:
      'Ship anchors and tenders guests ashore. Volume is real but paced by tender capacity — downtown peaks are often later and less sharp.',
  },
  {
    code: 'ANR',
    name: 'Anchorage (tender)',
    area: 'anchorage',
    latitude: 55.3395,
    longitude: -131.652,
    summary:
      'Anchorage call with tendering. Expect a longer arrival ramp than a pier-side mega-ship.',
  },
  {
    code: 'B3T',
    name: 'Berth 3 tender / overflow',
    area: 'downtown',
    latitude: 55.3422,
    longitude: -131.6462,
    summary: 'Overflow / tender assignment associated with the downtown berth 3 area.',
  },
  {
    code: 'D',
    name: 'Dock assignment D',
    area: 'other',
    latitude: 55.3422,
    longitude: -131.6461,
    summary: 'Less common dock code in the schedule feed — treat as a Ketchikan port call.',
  },
]

const DEFAULT_PLACE: BerthPlace = {
  code: 'UNK',
  name: 'Ketchikan Port',
  area: 'other',
  latitude: 55.3422,
  longitude: -131.6461,
  summary: 'Ketchikan cruise port call.',
}

export function resolveBerthPlace(berth: string): BerthPlace {
  const code = berth.trim().toUpperCase()
  return BERTH_PLACES.find((b) => b.code === code) ?? {
    ...DEFAULT_PLACE,
    code: code || 'UNK',
    name: code ? `Berth ${code}` : DEFAULT_PLACE.name,
  }
}
