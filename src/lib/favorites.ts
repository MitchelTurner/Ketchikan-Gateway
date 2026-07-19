const KEY = 'ktn-gateway-favorites'

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function toggleFavorite(id: string): string[] {
  const set = new Set(getFavorites())
  if (set.has(id)) set.delete(id)
  else set.add(id)
  const next = [...set]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}
