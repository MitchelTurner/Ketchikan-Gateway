import type { ShipVisit } from '../types'

export function ShipList({ ships }: { ships: ShipVisit[] }) {
  if (ships.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-fog-300 bg-white/50 px-5 py-8 text-center text-fog-500">
        No ships scheduled this day.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-fog-200 overflow-hidden rounded-2xl border border-fog-200 bg-white/80">
      {ships.map((ship) => (
        <li
          key={ship.id}
          className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold text-spruce-900 truncate">
              {ship.ship}
            </p>
            <p className="mt-0.5 text-sm text-fog-500">
              {ship.arrival}–{ship.departure}
              {ship.berth ? ` · Berth ${ship.berth}` : ''}
              {ship.direction ? ` · ${ship.direction === 'N' ? 'Northbound' : ship.direction === 'S' ? 'Southbound' : ship.direction}` : ''}
            </p>
            {ship.popularity_notes ? (
              <p className="mt-1 text-xs text-fog-400">{ship.popularity_notes}</p>
            ) : null}
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="font-display text-xl font-semibold tabular-nums text-channel-700">
              {(ship.actual_passengers || ship.estimated_passengers).toLocaleString()}
            </p>
            <p className="text-[0.7rem] font-medium tracking-wide text-fog-400 uppercase">
              {ship.actual_passengers > 0 ? 'actual' : 'estimated'} pax
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
