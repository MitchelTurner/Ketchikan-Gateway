const KEY = 'ktn-gateway-cancellations'

/** Visit IDs marked cancelled by an admin (local until PB notes support). */
export function getCancelledIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(arr)
  } catch {
    return new Set()
  }
}

export function setVisitCancelled(id: string, cancelled: boolean) {
  const set = getCancelledIds()
  if (cancelled) set.add(id)
  else set.delete(id)
  localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function applyCancellations<T extends { id: string }>(
  visits: T[],
): (T & { cancelled?: boolean })[] {
  const cancelled = getCancelledIds()
  return visits.map((v) =>
    cancelled.has(v.id) ? { ...v, cancelled: true } : { ...v, cancelled: false },
  )
}
