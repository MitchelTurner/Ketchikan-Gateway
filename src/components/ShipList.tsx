import { LINE_PROFILE_META } from '../lib/shipProfiles'
import { berthWeight, shipCapacity, shipSizeWeight } from '../lib/prediction'
import { inferLineProfile } from '../lib/shipProfiles'
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
      {ships.map((ship) => {
        const cap = shipCapacity(ship)
        const sizeW = shipSizeWeight(cap)
        const berthW = berthWeight(ship.berth)
        const profile = ship.lineProfile ?? inferLineProfile(ship.ship)
        const profileMeta = LINE_PROFILE_META[profile]
        const weighted = Math.round(
          cap * sizeW * berthW * profileMeta.downtownWeight,
        )
        return (
          <li
            key={ship.id}
            className={[
              'flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
              ship.cancelled
                ? 'border-l-4 border-l-alert-500 bg-alert-100/35 opacity-90'
                : '',
            ].join(' ')}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={[
                    'truncate font-display text-lg font-semibold text-spruce-900',
                    ship.cancelled ? 'line-through decoration-2' : '',
                  ].join(' ')}
                >
                  {ship.ship}
                </p>
                {ship.cancelled ? (
                  <span className="rounded-full bg-alert-500 px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-white uppercase">
                    Cancelled
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-sm text-fog-500">
                {ship.arrival}–{ship.departure}
                {ship.berth ? ` · Berth ${ship.berth}` : ''}
                {ship.direction
                  ? ` · ${ship.direction === 'N' ? 'Northbound' : ship.direction === 'S' ? 'Southbound' : ship.direction}`
                  : ''}
              </p>
              {!ship.cancelled && (
                <p className="mt-1 text-[0.7rem] text-fog-400">
                  {profileMeta.label}
                  {sizeW > 1 ? ' · mega-ship' : sizeW < 0.9 ? ' · expedition size' : ''}
                  {berthW < 1 ? ' · off-dock' : ''}
                </p>
              )}
              {ship.cancelled ? (
                <p className="mt-1 text-xs font-medium text-alert-600">
                  Not counted in today&apos;s forecast — do not plan around this call.
                </p>
              ) : null}
              {ship.popularity_notes ? (
                <p className="mt-1 text-xs text-fog-400">{ship.popularity_notes}</p>
              ) : null}
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="font-display text-xl font-semibold tabular-nums text-channel-700">
                {ship.cancelled ? '—' : cap.toLocaleString()}
              </p>
              <p className="text-[0.7rem] font-medium tracking-wide text-fog-400 uppercase">
                {ship.cancelled
                  ? 'cancelled'
                  : ship.actual_passengers > 0
                    ? 'actual'
                    : 'estimated'}{' '}
                pax
              </p>
              {!ship.cancelled && weighted !== cap && (
                <p className="text-[0.65rem] text-fog-400">
                  weighted {weighted.toLocaleString()}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
