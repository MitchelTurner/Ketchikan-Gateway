import { Link } from 'react-router-dom'
import { shipCapacity } from '../lib/prediction'
import { displayShipName, shipSlug } from '../lib/seo/slugs'
import type { ShipVisit } from '../types'

export function ScheduleTable({
  ships,
  caption,
  date,
}: {
  ships: ShipVisit[]
  caption: string
  date: string
}) {
  const rows = [...ships].sort((a, b) =>
    (a.arrival || '').localeCompare(b.arrival || ''),
  )

  return (
    <div className="-mx-3 overflow-x-auto overscroll-x-contain px-3 sm:mx-0 sm:px-0">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-fog-200 bg-white/80">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="border-b border-fog-100 px-3 py-3 text-left text-xs font-semibold tracking-wider text-fog-500 uppercase sm:px-4">
          {caption}
          <span className="mt-1 block font-normal normal-case tracking-normal text-fog-400">
            Alaska time · passenger counts are estimates unless marked actual.
          </span>
        </caption>
        <thead>
          <tr className="bg-fog-50 text-[0.7rem] tracking-wide text-fog-500 uppercase">
            <th scope="col" className="px-4 py-2 font-semibold">
              Ship
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              Berth
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              Arrival
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              Departure
            </th>
            <th scope="col" className="px-4 py-2 font-semibold text-right">
              Passengers
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-fog-500">
                No cruise ships are scheduled in Ketchikan on {date}.
              </td>
            </tr>
          ) : (
            rows.map((s) => {
              const cap = shipCapacity(s)
              const actual = s.actual_passengers > 0
              return (
                <tr
                  key={s.id}
                  className={
                    s.cancelled
                      ? 'border-t border-fog-100 bg-alert-100/30 text-fog-500'
                      : 'border-t border-fog-100'
                  }
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-display text-base font-semibold text-spruce-900"
                  >
                    <Link
                      to={`/ships/${shipSlug(s.ship)}`}
                      className={`no-underline hover:underline ${s.cancelled ? 'line-through' : 'text-spruce-900'}`}
                    >
                      {displayShipName(s.ship)}
                    </Link>
                    {s.cancelled ? (
                      <span className="ml-2 text-[0.65rem] font-bold tracking-wide text-alert-600 uppercase">
                        Cancelled
                      </span>
                    ) : null}
                  </th>
                  <td className="px-3 py-3">
                    <Link
                      to="/berths"
                      className="text-channel-700 no-underline hover:underline"
                    >
                      {s.berth || '—'}
                    </Link>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{s.arrival || '—'}</td>
                  <td className="px-3 py-3 tabular-nums">{s.departure || '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {s.cancelled ? '—' : cap.toLocaleString()}
                    {!s.cancelled && (
                      <span className="mt-0.5 block text-[0.65rem] text-fog-400 normal-case">
                        {actual ? 'actual' : 'estimated'}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}
