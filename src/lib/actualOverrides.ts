import type { ShipVisit } from '../types'

const KEY = 'ktn-gateway-actual-overrides'

/** Map of visit id → actual passenger count (local until pushed to PocketBase). */
export function getActualOverrides(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

export function setActualOverride(visitId: string, actual: number) {
  const map = getActualOverrides()
  map[visitId] = actual
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function clearActualOverride(visitId: string) {
  const map = getActualOverrides()
  delete map[visitId]
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function applyActualOverrides(visits: ShipVisit[]): ShipVisit[] {
  const map = getActualOverrides()
  if (Object.keys(map).length === 0) return visits
  return visits.map((v) =>
    map[v.id] != null ? { ...v, actual_passengers: map[v.id] } : v,
  )
}
