import type { DayForecast } from '../types'

const STYLES = {
  high: 'bg-spruce-50 text-spruce-800 border-spruce-200',
  medium: 'bg-busy-100/70 text-busy-600 border-busy-100',
  low: 'bg-alert-100/70 text-alert-600 border-alert-100',
} as const

export function ConfidenceBadge({ day }: { day: DayForecast }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-xs ${STYLES[day.confidence]}`}
      title={day.confidenceDetail}
    >
      <span className="font-semibold">{day.confidenceLabel}</span>
      <span className="opacity-80"> — {day.confidenceDetail}</span>
    </div>
  )
}
