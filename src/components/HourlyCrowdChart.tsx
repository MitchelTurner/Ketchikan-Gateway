import type { HourlyCrowdPoint } from '../types'
import { bestClearWindow } from '../lib/prediction'

export function HourlyCrowdChart({
  points,
  peakHour,
}: {
  points: HourlyCrowdPoint[]
  peakHour: number | null
}) {
  if (points.length === 0) return null
  const max = Math.max(...points.map((p) => p.passengers), 1)
  const clear = bestClearWindow(points)

  return (
    <div className="rounded-2xl border border-fog-200 bg-white/80 p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-spruce-900">
            Hourly downtown curve
          </h3>
          <p className="text-sm text-fog-500">
            Predicted passengers ashore by hour
            {peakHour != null
              ? ` · peak ${points.find((p) => p.hour === peakHour)?.label ?? ''}`
              : ''}
          </p>
        </div>
        {clear && (
          <p className="rounded-full bg-spruce-50 px-3 py-1 text-xs font-semibold text-spruce-800">
            Clearest window {clear.label}
          </p>
        )}
      </div>

      <div className="mt-5 flex h-40 items-end gap-1 sm:gap-1.5">
        {points.map((p) => {
          const height = Math.max(4, Math.round((p.passengers / max) * 100))
          const isPeak = p.hour === peakHour
          const wet = p.precipMm >= 0.3
          return (
            <div key={p.hour} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex h-32 w-full items-end justify-center">
                <div
                  title={`${p.label}: ${p.passengers.toLocaleString()} · ${p.shipsInPort} ships${wet ? ` · ${p.precipMm.toFixed(1)}mm` : ''}`}
                  className={[
                    'w-full max-w-[1.75rem] rounded-t-md transition-all duration-500',
                    isPeak
                      ? 'bg-spruce-700'
                      : wet
                        ? 'bg-channel-400/80'
                        : 'bg-channel-600/70',
                  ].join(' ')}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span
                className={[
                  'text-[0.6rem] font-medium',
                  isPeak ? 'text-spruce-800' : 'text-fog-400',
                ].join(' ')}
              >
                {p.label.replace('AM', 'a').replace('PM', 'p')}
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-[0.7rem] text-fog-400">
        Teal bars with rain shading show wetter hours. Use the clearest window to time
        downtown.
      </p>
    </div>
  )
}
