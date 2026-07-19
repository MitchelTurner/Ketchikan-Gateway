import type { DayForecast } from '../types'

export function CapacitySplit({ day }: { day: DayForecast }) {
  const scheduled = day.scheduledPassengers
  const predicted = day.predictedDowntown
  const max = Math.max(scheduled, predicted, 1)
  const scheduledPct = Math.round((scheduled / max) * 100)
  const predictedPct = Math.round((predicted / max) * 100)

  return (
    <div className="rounded-2xl border border-fog-200 bg-white/80 p-5">
      <p className="text-xs font-semibold tracking-wider text-fog-500 uppercase">
        Scheduled vs expected ashore
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-fog-600">Ships scheduled</span>
            <span className="font-display font-semibold tabular-nums text-fog-800">
              {scheduled.toLocaleString()}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-fog-100">
            <div
              className="h-full rounded-full bg-fog-400 transition-all duration-700"
              style={{ width: `${scheduledPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-channel-700">Expected ashore</span>
            <span className="font-display font-semibold tabular-nums text-channel-700">
              {predicted.toLocaleString()}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-channel-100">
            <div
              className="h-full rounded-full bg-channel-600 transition-all duration-700"
              style={{ width: `${predictedPct}%` }}
            />
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-fog-500">
        Capacity is who could come; ashore is who we expect downtown after weather, ship
        size, and berth weighting.
      </p>
    </div>
  )
}
