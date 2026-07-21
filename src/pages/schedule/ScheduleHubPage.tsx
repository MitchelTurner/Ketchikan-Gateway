import { Navigate } from 'react-router-dom'
import { monthSlug } from '../../lib/seo/slugs'
import { todayInAlaska } from '../../lib/utils'

/** `/schedule` opens this month’s calendar. */
export function ScheduleHubPage() {
  const today = todayInAlaska()
  const year = today.slice(0, 4)
  const month = monthSlug(Number(today.slice(5, 7)) - 1)
  return <Navigate to={`/schedule/${year}/${month}`} replace />
}
