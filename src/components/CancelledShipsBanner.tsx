import { Link } from 'react-router-dom'
import type { ShipVisit } from '../types'

type Props = {
  ships: ShipVisit[]
  date: string
}

export function CancelledShipsBanner({ ships, date }: Props) {
  const cancelled = ships.filter((s) => s.cancelled)
  if (cancelled.length === 0) return null

  return (
    <section
      className="rounded-2xl border-2 border-alert-500/40 bg-alert-100/50 px-4 py-4"
      aria-label="Cancelled ships"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-alert-600">
        Cancelled — do not plan around these
      </p>
      <ul className="mt-3 space-y-2">
        {cancelled.map((s) => (
          <li key={s.id} className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-display text-lg font-semibold text-spruce-950 line-through decoration-2">
              {s.ship}
            </span>
            <span className="text-sm text-fog-600">
              {s.arrival || '—'}–{s.departure || '—'}
              {s.berth ? ` · Berth ${s.berth}` : ''}
              {s.estimated_passengers
                ? ` · ~${s.estimated_passengers.toLocaleString()} pax`
                : ''}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-fog-700">
        Struck from today&apos;s forecast. Confirm on the Port PDF or{' '}
        <Link to={`/schedule/${date}`} className="font-semibold text-channel-700 underline underline-offset-2">
          day detail
        </Link>
        .
      </p>
    </section>
  )
}
