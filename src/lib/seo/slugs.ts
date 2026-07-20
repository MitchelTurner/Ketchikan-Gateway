const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const

export type MonthSlug = (typeof MONTHS)[number]

/** Stable kebab-case ship slug. */
export function shipSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function displayShipName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w) => {
      if (['ncl', 'ng', 'ss', 'ww', 'we'].includes(w)) return w.toUpperCase()
      return w.charAt(0).toUpperCase() + w.slice(1)
    })
    .join(' ')
}

export function monthSlug(monthIndex0: number): MonthSlug {
  return MONTHS[monthIndex0] ?? 'january'
}

export function monthIndex(slug: string): number | null {
  const i = MONTHS.indexOf(slug.toLowerCase() as MonthSlug)
  return i >= 0 ? i : null
}

export function monthLabel(slug: string): string {
  const i = monthIndex(slug)
  if (i == null) return slug
  return MONTHS[i].charAt(0).toUpperCase() + MONTHS[i].slice(1)
}

export function isIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T12:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

export function isYear(s: string): boolean {
  return /^\d{4}$/.test(s)
}

/** Redirect map if a vessel is renamed — oldSlug → newSlug. */
export const SHIP_SLUG_REDIRECTS: Record<string, string> = {
  // e.g. 'celebrity-millennium': 'summit',
}
