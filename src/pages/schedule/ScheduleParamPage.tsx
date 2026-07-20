import { Navigate, useParams } from 'react-router-dom'
import { isIsoDate, isYear } from '../../lib/seo/slugs'
import { ScheduleDayPage } from './ScheduleDayPage'
import { ScheduleYearPage } from './ScheduleYearPage'

/** Disambiguate `/schedule/:param` as ISO date vs year. */
export function ScheduleParamPage() {
  const { date: param = '' } = useParams()
  if (isIsoDate(param) || param === 'today' || param === 'tomorrow') {
    return <ScheduleDayPage />
  }
  if (isYear(param)) {
    return <ScheduleYearPage />
  }
  return <Navigate to="/404" replace />
}
