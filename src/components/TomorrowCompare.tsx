import { Link } from 'react-router-dom'
import { compareTomorrow } from '../lib/compareDays'
import { addDays, todayInAlaska } from '../lib/utils'
import type { DayForecast } from '../types'

export function TomorrowCompare({
  today,
  tomorrow,
}: {
  today: DayForecast
  tomorrow: DayForecast
}) {
  const text = compareTomorrow(today, tomorrow)
  const tomDate = tomorrow.date || addDays(todayInAlaska(), 1)

  return (
    <div className="rounded-2xl border border-channel-200 bg-gradient-to-r from-channel-50 to-white px-5 py-4">
      <p className="text-xs font-semibold tracking-wider text-channel-700 uppercase">
        Tomorrow vs today
      </p>
      <p className="mt-1 text-sm leading-relaxed text-spruce-900">{text}</p>
      <Link
        to={`/schedule/${tomDate}`}
        className="mt-3 inline-block text-sm font-semibold text-channel-700 underline-offset-2 hover:underline"
      >
        Open tomorrow’s day card →
      </Link>
    </div>
  )
}
