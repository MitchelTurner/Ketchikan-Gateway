import { downtownTimeline } from '../lib/downtownNow'
import type { DayForecast } from '../types'

export function DowntownTimeline({ day }: { day: DayForecast }) {
  const t = downtownTimeline(day)
  if (!t.firstArrival) return null

  const steps = [
    { label: 'Arrivals', value: t.firstArrival, hint: 'First ship' },
    { label: 'Peak', value: t.peak ?? '—', hint: 'Heaviest ashore' },
    { label: 'Clear-out', value: t.clearOut ?? '—', hint: 'Last departure' },
  ]

  return (
    <div className="rounded-2xl border border-fog-200 bg-white/80 px-4 py-4">
      <p className="text-xs font-semibold tracking-wider text-fog-500 uppercase">
        Downtown timeline
      </p>
      <ol className="mt-3 grid grid-cols-3 gap-2">
        {steps.map((s, i) => (
          <li key={s.label} className="relative text-center">
            {i < steps.length - 1 && (
              <span
                className="absolute top-3 left-[58%] hidden h-px w-[84%] bg-fog-200 sm:block"
                aria-hidden
              />
            )}
            <p className="relative z-[1] mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full bg-spruce-900 text-[0.65rem] font-bold text-fog-50">
              {i + 1}
            </p>
            <p className="text-[0.65rem] font-semibold tracking-wide text-fog-400 uppercase">
              {s.label}
            </p>
            <p className="font-display text-lg font-semibold tabular-nums text-spruce-900">
              {s.value}
            </p>
            <p className="text-[0.65rem] text-fog-500">{s.hint}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
