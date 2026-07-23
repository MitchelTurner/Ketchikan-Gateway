import type { DayForecast } from '../types'
import type { Guide, GuideSection } from '../data/guides'

/** Stable DOM id for TOC anchors */
export function sectionDomId(section: GuideSection): string {
  if (section.id) return section.id
  return section.heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Parse "HH:MM" → minutes from midnight */
function timeToMinutes(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim())
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

/**
 * Rough usable shore window in hours from earliest arrival to latest departure
 * (minus ~45m buffer). Used to suggest tour duration caps.
 */
export function shoreWindowHours(day: DayForecast): number | null {
  const ships = day.ships.filter((s) => !s.cancelled)
  if (ships.length === 0) return null
  let earliest = Infinity
  let latest = -Infinity
  for (const s of ships) {
    const a = timeToMinutes(s.arrival || '07:00')
    const d = timeToMinutes(s.departure || '17:00')
    if (a == null || d == null) continue
    earliest = Math.min(earliest, a)
    latest = Math.max(latest, d)
  }
  if (!Number.isFinite(earliest) || !Number.isFinite(latest) || latest <= earliest) {
    return null
  }
  const usable = (latest - earliest - 45) / 60
  return Math.max(1, Math.round(usable * 10) / 10)
}

export function guideMatchesQuery(guide: Guide, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay = [
    guide.title,
    guide.description,
    guide.focusKeyword,
    ...guide.tags,
    ...guide.sections.flatMap((s) => [
      s.heading,
      ...s.body,
      ...(s.items?.flatMap((i) => [i.name, i.detail]) ?? []),
    ]),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(needle)
}

export function filterGuideSections(guide: Guide, q: string): GuideSection[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return guide.sections
  return guide.sections
    .map((s) => {
      const headingHit = s.heading.toLowerCase().includes(needle)
      const bodyHit = s.body.some((p) => p.toLowerCase().includes(needle))
      if (headingHit || bodyHit) return s
      const items = s.items?.filter(
        (i) =>
          i.name.toLowerCase().includes(needle) ||
          i.detail.toLowerCase().includes(needle),
      )
      if (items && items.length > 0) return { ...s, items }
      return null
    })
    .filter((s): s is GuideSection => s != null)
}

export function buildDayPlanText(args: {
  guideTitle: string
  crowdLabel: string
  shipCount: number
  stops: string[]
  scheduleUrl: string
  toursUrl: string
}): string {
  const stops =
    args.stops.length > 0
      ? args.stops.map((s, i) => `${i + 1}. ${s}`).join('\n')
      : '1. Creek Street (early or late)\n2. Rainforest trail midday\n3. One booked tour away from the docks'
  return [
    `Ketchikan day plan — ${args.guideTitle}`,
    `Crowd today: ${args.crowdLabel} · ${args.shipCount} ship${args.shipCount === 1 ? '' : 's'}`,
    '',
    'Suggested stops:',
    stops,
    '',
    `Live schedule: ${args.scheduleUrl}`,
    `Bookable tours: ${args.toursUrl}`,
    '',
    'Via KTN Port',
  ].join('\n')
}
