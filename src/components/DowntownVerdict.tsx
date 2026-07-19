import type { DayForecast } from '../types'

const STYLES = {
  quiet: {
    wrap: 'border-spruce-200 bg-spruce-50 text-spruce-800',
    badge: 'bg-spruce-700 text-fog-50',
  },
  okay: {
    wrap: 'border-busy-100 bg-busy-100/60 text-busy-600',
    badge: 'bg-busy-500 text-white',
  },
  avoid: {
    wrap: 'border-alert-100 bg-alert-100 text-alert-600',
    badge: 'bg-alert-500 text-white',
  },
} as const

export function DowntownVerdictBanner({ day }: { day: DayForecast }) {
  const style = STYLES[day.verdict]
  return (
    <div className={`rounded-2xl border px-5 py-4 ${style.wrap}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${style.badge}`}
        >
          Downtown today
        </span>
        <p className="font-display text-2xl font-semibold">{day.verdictLabel}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed opacity-90">{day.verdictDetail}</p>
    </div>
  )
}
