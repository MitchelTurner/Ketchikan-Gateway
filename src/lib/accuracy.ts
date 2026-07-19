import type { DayForecast, PredictionLogEntry, WeatherCondition } from '../types'

const LOG_KEY = 'ktn-gateway-prediction-log'
const MAX_ENTRIES = 200

function readLog(): PredictionLogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PredictionLogEntry[]
  } catch {
    return []
  }
}

function writeLog(entries: PredictionLogEntry[]) {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)))
}

export function getPredictionLog(): PredictionLogEntry[] {
  return readLog().sort((a, b) => a.date.localeCompare(b.date))
}

export function upsertPredictionLog(entry: Omit<PredictionLogEntry, 'loggedAt'>) {
  const log = readLog()
  const idx = log.findIndex((e) => e.date === entry.date)
  const next: PredictionLogEntry = {
    ...entry,
    loggedAt: new Date().toISOString(),
  }
  if (idx >= 0) log[idx] = { ...log[idx], ...next }
  else log.push(next)
  writeLog(log)
}

/** Record today's forecast; attach actuals when available. */
export function syncForecastToLog(day: DayForecast) {
  if (day.ships.length === 0 && day.scheduledPassengers === 0) return
  upsertPredictionLog({
    date: day.date,
    predicted: day.predictedDowntown,
    scheduled: day.scheduledPassengers,
    actual: day.hasActuals ? day.actualTotal : null,
    condition: (day.weather?.condition ?? 'cloudy') as WeatherCondition,
    ashoreFactor: day.weather?.ashoreFactor ?? 0.85,
  })
}

export function setActualForDate(date: string, actual: number) {
  const log = readLog()
  const idx = log.findIndex((e) => e.date === date)
  if (idx >= 0) {
    log[idx] = {
      ...log[idx],
      actual,
      loggedAt: new Date().toISOString(),
    }
  } else {
    log.push({
      date,
      predicted: 0,
      scheduled: 0,
      actual,
      condition: 'cloudy',
      ashoreFactor: 0.85,
      loggedAt: new Date().toISOString(),
    })
  }
  writeLog(log)
}

/**
 * Calibration bias from days with both predicted and actual totals.
 * Clamped so a few outliers don't wreck the model.
 */
export function calibrationBiasFromLog(): number {
  const scored = readLog().filter(
    (e) => e.actual != null && e.actual > 0 && e.predicted > 0,
  )
  if (scored.length < 2) return 1

  const ratios = scored.map((e) => (e.actual as number) / e.predicted)
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length
  return Math.min(1.15, Math.max(0.85, avg))
}

export function accuracyStats() {
  const scored = readLog().filter(
    (e) => e.actual != null && e.actual > 0 && e.predicted > 0,
  )
  if (scored.length === 0) {
    return {
      samples: 0,
      meanAbsError: 0,
      meanAbsPercentError: 0,
      bias: 1,
    }
  }
  const errors = scored.map((e) => Math.abs((e.actual as number) - e.predicted))
  const pct = scored.map(
    (e) => Math.abs((e.actual as number) - e.predicted) / (e.actual as number),
  )
  return {
    samples: scored.length,
    meanAbsError: Math.round(errors.reduce((a, b) => a + b, 0) / errors.length),
    meanAbsPercentError: Math.round(
      (pct.reduce((a, b) => a + b, 0) / pct.length) * 100,
    ),
    bias: calibrationBiasFromLog(),
  }
}
