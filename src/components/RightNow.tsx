import { currentShoreSnapshot, shouldGoDowntown } from '../lib/downtownNow'
import type { DayForecast } from '../types'
import { CROWD_META } from '../lib/utils'

export function RightNowPanel({ day }: { day: DayForecast }) {
  const snap = currentShoreSnapshot(day)
  const answer = shouldGoDowntown(day)
  const meta = CROWD_META[snap.level]
  const hour = snap.hour
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hasShips = snap.shipsNow.length > 0

  return (
    <div className="rounded-2xl border border-spruce-800/20 bg-spruce-900 px-4 py-4 text-fog-50 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-dawn-400 uppercase">
            Right now · {displayHour}
            {ampm} AK
          </p>
          <p className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">
            {hasShips
              ? `${snap.shipsNow.length} ship${snap.shipsNow.length === 1 ? '' : 's'} in port`
              : answer.short}
          </p>
        </div>
        {hasShips ? (
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            {meta.label} · ~{snap.passengers.toLocaleString()} ashore
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-channel-200">{answer.detail}</p>
      {hasShips ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {snap.shipsNow.map((s) => (
            <li
              key={s.id}
              className="max-w-full truncate rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-fog-100"
            >
              {s.ship}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
