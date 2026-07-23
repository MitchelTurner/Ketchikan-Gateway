import { Link } from 'react-router-dom'
import { useGateway } from '../../hooks/GatewayContext'
import { shoreWindowHours } from '../../lib/guideHelpers'
import { addDays, CROWD_META, todayInAlaska } from '../../lib/utils'

type Props = {
  /** Extra links for specific guides */
  showActivities?: boolean
}

export function GuideLiveModule({ showActivities }: Props) {
  const { getDay } = useGateway()
  const todayIso = todayInAlaska()
  const tomorrowIso = addDays(todayIso, 1)
  const today = getDay(todayIso)
  const tomorrow = getDay(tomorrowIso)
  const todayShips = today.ships.filter((s) => !s.cancelled).length
  const tomorrowShips = tomorrow.ships.filter((s) => !s.cancelled).length
  const todayMeta = CROWD_META[today.weatherAdjustedCrowd]
  const tomorrowMeta = CROWD_META[tomorrow.weatherAdjustedCrowd]
  const shoreHrs = shoreWindowHours(today)

  const tip =
    today.weatherAdjustedCrowd === 'extreme' || today.weatherAdjustedCrowd === 'busy'
      ? 'Busy docks today — book a tour away from Creek Street or go early/late.'
      : todayShips === 0
        ? 'Quiet day — great for DIY downtown and photos.'
        : 'Manageable crowds — mix a short walk with one booked outing.'

  return (
    <aside
      className="guide-live rounded-2xl border border-channel-200 bg-channel-50/70 px-4 py-4 print:border print:bg-white"
      aria-label="Live schedule context"
    >
      <p className="text-[0.65rem] font-semibold tracking-wider text-channel-700 uppercase">
        Live from the schedule
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/schedule/${todayIso}`}
          className="rounded-xl border border-fog-200 bg-white/90 px-3 py-3 no-underline transition hover:border-channel-400"
        >
          <p className="text-xs font-medium text-fog-500">Today</p>
          <p className="mt-1 font-display text-lg font-semibold text-spruce-900">
            {todayMeta.label}
            <span className="ml-2 text-sm font-sans font-medium text-fog-600">
              · {todayShips} ship{todayShips === 1 ? '' : 's'}
            </span>
          </p>
          <p className="mt-1 text-xs text-fog-600">
            {today.scheduledPassengers.toLocaleString()} scheduled pax
            {shoreHrs != null ? ` · ~${shoreHrs}h shore window` : ''}
          </p>
        </Link>
        <Link
          to={`/schedule/${tomorrowIso}`}
          className="rounded-xl border border-fog-200 bg-white/90 px-3 py-3 no-underline transition hover:border-channel-400"
        >
          <p className="text-xs font-medium text-fog-500">Tomorrow</p>
          <p className="mt-1 font-display text-lg font-semibold text-spruce-900">
            {tomorrowMeta.label}
            <span className="ml-2 text-sm font-sans font-medium text-fog-600">
              · {tomorrowShips} ship{tomorrowShips === 1 ? '' : 's'}
            </span>
          </p>
          <p className="mt-1 text-xs text-fog-600">
            {tomorrow.scheduledPassengers.toLocaleString()} scheduled pax
          </p>
        </Link>
      </div>
      <p className="mt-3 text-sm text-spruce-900">{tip}</p>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        <Link to={`/schedule/${todayIso}`} className="font-semibold text-channel-700">
          Today’s day page
        </Link>
        <Link to="/schedule" className="font-semibold text-channel-700">
          Full calendar
        </Link>
        <Link to="/stats" className="font-semibold text-channel-700">
          Season stats
        </Link>
        {showActivities && (
          <Link to="/activities" className="font-semibold text-channel-700">
            Activities by crowd
          </Link>
        )}
      </p>
    </aside>
  )
}
