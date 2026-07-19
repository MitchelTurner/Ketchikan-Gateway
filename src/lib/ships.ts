import PocketBase from 'pocketbase'
import type { ShipVisit } from '../types'
import { applyActualOverrides } from './actualOverrides'

const PB_URL =
  import.meta.env.VITE_POCKETBASE_URL ?? 'https://vc956574645937.coderick.net'

export const pb = new PocketBase(PB_URL)

export function normalizeVisit(raw: Record<string, unknown>): ShipVisit {
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
    return { visits: applyActualOverrides(visits), source: 'pocketbase' }
  } catch (err) {
    console.warn('PocketBase unavailable, using bundled schedule', err)
    const visits = await fetchLocalFallback()
    return { visits: applyActualOverrides(visits), source: 'local' }
  }
}

export async function loginAdmin(email: string, password: string) {
  return pb.collection('users').authWithPassword(email, password)
}

export function logoutAdmin() {
  pb.authStore.clear()
}

export function isAdminAuthed(): boolean {
  return pb.authStore.isValid
}

export async function updateVisitActual(id: string, actual: number) {
  return pb.collection('ship_visits').update(id, { actual_passengers: actual })
}

export async function createShipVisit(visit: Omit<ShipVisit, 'id'>) {
  return pb.collection('ship_visits').create({
    date: visit.date,
    ship: visit.ship,
    arrival: visit.arrival,
    departure: visit.departure,
    berth: visit.berth,
    direction: visit.direction,
    estimated_passengers: visit.estimated_passengers,
    actual_passengers: visit.actual_passengers,
    notes: visit.notes,
    popularity_notes: visit.popularity_notes,
  })
}

export async function importVisitsToPocketBase(
  rows: Omit<ShipVisit, 'id'>[],
): Promise<{ created: number; errors: string[] }> {
  let created = 0
  const errors: string[] = []
  for (const row of rows) {
    try {
      await createShipVisit(row)
      created += 1
    } catch (e) {
      errors.push(
        `${row.date} ${row.ship}: ${e instanceof Error ? e.message : 'failed'}`,
      )
    }
  }
  return { created, errors }
}
