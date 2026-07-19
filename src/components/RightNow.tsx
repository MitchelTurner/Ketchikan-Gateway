import type { DayForecast } from '../types'
import { CROWD_META, currentAlaskaHour, crowdFromPassengers } from '../lib/utils'

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h + (m >= 30 ? 0.5 : 0)
}

export function RightNowPanel({ day }: { day: DayForecast }) {
  const hour = currentAlaskaHour()
  const point =
    day.hourlyCrowd.find((h) => h.hour === hour) ??
    day.hourlyCrowd.find((h) => h.hour === Math.floor(hour))

  const shipsNow = day.ships.filter((s) => {
    if (s.cancelled) return false
    return parseHour(s.arrival) <= hour && hour < parseHour(s.departure)
  })

  const pax = point?.passengers ?? 0
  const level = crowdFromPassengers(pax, shipsNow.length)
  const meta = CROWD_META[level]

  const advice =
    level === 'extreme' || (level === 'busy' && hour >= 10 && hour < 14)
      ? 'Stay off the waterfront if you can — peak pressure right now.'
      : level === 'busy'
        ? 'Downtown is busy. Fine for a quick stop; skip lingering on Creek Street.'
        : level === 'moderate'
          ? 'Manageable right now — a decent window to run errands downtown.'
          : shipsNow.length === 0
            ? 'No ships in port this hour. Downtown should feel open.'
            : 'Light traffic ashore. Good time to head downtown.'

  return (
    <div className="rounded-2xl border border-spruce-800/20 bg-spruce-900 px-5 py-5 text-fog-50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-dawn-400 uppercase">
            Right now · {hour % 12 === 0 ? 12 : hour % 12}
            {hour >= 12 ? 'PM' : 'AM'} AK
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">
            {shipsNow.length === 0
              ? 'No ships alongside'
              : `${shipsNow.length} ship${shipsNow.length === 1 ? '' : 's'} in port`}
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
          {meta.label} · ~{pax.toLocaleString()} ashore
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-channel-200">{advice}</p>
      {shipsNow.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {shipsNow.map((s) => (
            <li
              key={s.id}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-fog-100"
            >
              {s.ship}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
