import { QUIET_SPOTS } from '../lib/quietHours'
import type { CrowdLevel } from '../types'

export function QuietHoursMap({ level }: { level: CrowdLevel }) {
  return (
    <div className="rounded-2xl border border-fog-200 bg-white/80 p-5">
      <h3 className="font-display text-xl font-semibold text-spruce-900">
        Quiet-hours map
      </h3>
      <p className="mt-1 text-sm text-fog-500">
        Where to go when today is {level}. Time bands are relative to typical cruise peaks.
      </p>
      <ul className="mt-4 space-y-3">
        {QUIET_SPOTS.map((spot) => (
          <li
            key={spot.id}
            className="flex flex-col gap-1 border-b border-fog-100 pb-3 last:border-0 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p className="font-semibold text-spruce-900">{spot.name}</p>
              <p className="text-sm text-fog-600">{spot.note}</p>
            </div>
            <span className="shrink-0 rounded-full bg-spruce-50 px-3 py-1 text-xs font-semibold text-spruce-800">
              {spot.band}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
