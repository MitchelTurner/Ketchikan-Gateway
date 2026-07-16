import { CROWD_META } from '../lib/utils'
import type { CrowdLevel } from '../types'

const WIDTH: Record<CrowdLevel, string> = {
  low: '25%',
  moderate: '50%',
  busy: '75%',
  extreme: '100%',
}

export function CrowdMeter({
  level,
  passengers,
  label,
  compact = false,
}: {
  level: CrowdLevel
  passengers: number
  label?: string
  compact?: boolean
}) {
  const meta = CROWD_META[level]
  const toneClass = `crowd-${meta.tone}`

  if (compact) {
    return (
      <span
        className={`${toneClass} inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--crowd)_35%,transparent)] bg-[var(--crowd-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--crowd-ink)]`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--crowd)]"
          aria-hidden
        />
        {meta.label}
        {passengers > 0 ? ` · ${passengers.toLocaleString()}` : ''}
      </span>
    )
  }

  return (
    <div className={`${toneClass} rounded-2xl border border-[color-mix(in_oklab,var(--crowd)_25%,transparent)] bg-[var(--crowd-soft)] p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[var(--crowd-ink)] uppercase opacity-80">
            {label ?? 'Crowd level'}
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-[var(--crowd-ink)]">
            {meta.label}
          </p>
        </div>
        {passengers > 0 && (
          <p className="text-right">
            <span className="block font-display text-2xl font-semibold text-[var(--crowd-ink)] tabular-nums">
              {passengers.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-[var(--crowd-ink)] opacity-70">
              predicted ashore
            </span>
          </p>
        )}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-[var(--crowd)] transition-all duration-700"
          style={{ width: WIDTH[level] }}
        />
      </div>
      <p className="mt-3 text-sm text-[var(--crowd-ink)] opacity-90">{meta.message}</p>
    </div>
  )
}
