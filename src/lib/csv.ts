import type { ShipVisit } from '../types'

const ALIASES: Record<string, keyof ShipVisit | 'skip'> = {
  date: 'date',
  ship: 'ship',
  ship_name: 'ship',
  vessel: 'ship',
  arrival: 'arrival',
  arrive: 'arrival',
  arrivaltime: 'arrival',
  arrival_time: 'arrival',
  departure: 'departure',
  depart: 'departure',
  departuretime: 'departure',
  departure_time: 'departure',
  berth: 'berth',
  dock: 'berth',
  pier: 'berth',
  direction: 'direction',
  estimated_passengers: 'estimated_passengers',
  passengers: 'estimated_passengers',
  ship_capacity: 'estimated_passengers',
  capacity: 'estimated_passengers',
  estimated: 'estimated_passengers',
  actual_passengers: 'actual_passengers',
  actual_pax: 'actual_passengers',
  actual: 'actual_passengers',
  notes: 'notes',
  popularity_notes: 'popularity_notes',
  popularity: 'popularity_notes',
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else cur += c
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function normalizeDate(raw: string): string {
  const s = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) {
    return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`
  }
  return s
}

export interface CsvImportResult {
  rows: Omit<ShipVisit, 'id'>[]
  errors: string[]
}

export function parseShipVisitsCsv(text: string): CsvImportResult {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    return { rows: [], errors: ['CSV needs a header row and at least one data row.'] }
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader)
  const mapped = headers.map((h) => ALIASES[h] ?? null)
  if (!mapped.includes('date') || !mapped.includes('ship')) {
    return {
      rows: [],
      errors: ['CSV must include date and ship (or ship_name) columns.'],
    }
  }

  const rows: Omit<ShipVisit, 'id'>[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const raw: Partial<Record<keyof ShipVisit, string>> = {}
    mapped.forEach((key, idx) => {
      if (!key || key === 'skip') return
      raw[key] = cols[idx] ?? ''
    })

    if (!raw.date || !raw.ship) {
      errors.push(`Row ${i + 1}: missing date or ship`)
      continue
    }

    rows.push({
      date: normalizeDate(raw.date),
      ship: String(raw.ship).toUpperCase(),
      arrival: raw.arrival || '08:00',
      departure: raw.departure || '17:00',
      berth: raw.berth || '',
      direction: raw.direction || '',
      estimated_passengers: Number(raw.estimated_passengers || 0) || 0,
      actual_passengers: Number(raw.actual_passengers || 0) || 0,
      notes: raw.notes || '',
      popularity_notes: raw.popularity_notes || '',
    })
  }

  return { rows, errors }
}
