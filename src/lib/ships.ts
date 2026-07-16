import PocketBase from 'pocketbase'
import type { ShipVisit } from '../types'

const PB_URL =
  import.meta.env.VITE_POCKETBASE_URL ?? 'https://vc956574645937.coderick.net'

export const pb = new PocketBase(PB_URL)

function normalizeVisit(raw: Record<string, unknown>): ShipVisit {
  const date = String(raw.date ?? '')
    .split(' ')[0]
    .split('T')[0]
  return {
    id: String(raw.id ?? ''),
    date,
    ship: String(raw.ship ?? ''),
    arrival: String(raw.arrival ?? ''),
    departure: String(raw.departure ?? ''),
    berth: String(raw.berth ?? ''),
    direction: String(raw.direction ?? ''),
    estimated_passengers: Number(raw.estimated_passengers ?? 0),
    actual_passengers: Number(raw.actual_passengers ?? 0),
    notes: String(raw.notes ?? ''),
    popularity_notes: String(raw.popularity_notes ?? ''),
  }
}

async function fetchFromPocketBase(): Promise<ShipVisit[]> {
  const records = await pb.collection('ship_visits').getFullList({
    sort: 'date,arrival',
    requestKey: null,
  })
  return records.map((r) => normalizeVisit(r as unknown as Record<string, unknown>))
}

async function fetchLocalFallback(): Promise<ShipVisit[]> {
  const res = await fetch('/ship_visits.json')
  if (!res.ok) throw new Error('Failed to load local schedule')
  const data = (await res.json()) as ShipVisit[]
  return data.map((r) => normalizeVisit(r as unknown as Record<string, unknown>))
}

export async function loadShipVisits(): Promise<{
  visits: ShipVisit[]
  source: 'pocketbase' | 'local'
}> {
  try {
    const visits = await fetchFromPocketBase()
    if (visits.length === 0) throw new Error('Empty PocketBase response')
    return { visits, source: 'pocketbase' }
  } catch (err) {
    console.warn('PocketBase unavailable, using bundled schedule', err)
    const visits = await fetchLocalFallback()
    return { visits, source: 'local' }
  }
}
