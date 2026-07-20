import { Link, Navigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { useGateway } from '../../hooks/GatewayContext'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { isYear, monthIndex, monthLabel } from '../../lib/seo/slugs'
import { daysInMonth, firstWeekday } from '../../lib/utils'

export function ScheduleMonthPage() {
  const { year: yearParam = '', month: monthParam = '' } = useParams()
  const { getDay } = useGateway()

  if (!isYear(yearParam)) return <Navigate to="/404" replace />
  const mi = monthIndex(monthParam)
  if (mi == null) return <Navigate to="/404" replace />

  const year = Number(yearParam)
  const meta = buildMeta({ type: 'month', year, monthSlug: monthParam.toLowerCase() })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: String(year), path: `/schedule/${year}` },
    {
      name: monthLabel(monthParam),
      path: `/schedule/${year}/${monthParam.toLowerCase()}`,
    },
  ]

  const dim = daysInMonth(year, mi)
  const start = firstWeekday(year, mi)
  const cells: (string | null)[] = []
  for (let i = 0; i < start; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) {
    cells.push(
      `${year}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 overflow-x-clip px-3 py-6 sm:space-y-8 sm:px-4 sm:py-10">
      <Seo
        meta={meta}
        jsonLd={[organizationJsonLd(), websiteJsonLd(), breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <header>
        <h1 className="font-display text-2xl font-semibold text-spruce-900 sm:text-3xl">
          {meta.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-fog-600 sm:text-base">
          Tap a date for ships, berths, and the downtown crowd forecast.
        </p>
      </header>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[0.6rem] font-semibold tracking-wide text-fog-400 uppercase sm:gap-1 sm:text-[0.65rem]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="py-1">
            <span className="sm:hidden">{d}</span>
            <span className="hidden sm:inline">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((iso, i) => {
          if (!iso) return <div key={`e-${i}`} />
          const day = getDay(iso)
          const n = day.ships.filter((s) => !s.cancelled).length
          const dom = Number(iso.slice(8, 10))
          return (
            <Link
              key={iso}
              to={`/schedule/${iso}`}
              className="flex min-h-14 flex-col rounded-lg border border-fog-200 bg-white/80 p-1 no-underline transition hover:border-channel-400 sm:min-h-[5.5rem] sm:rounded-xl sm:p-2"
            >
              <span className="text-[0.7rem] font-semibold text-spruce-900 sm:text-xs">
                {dom}
              </span>
              <span className="mt-auto text-[0.55rem] leading-tight text-fog-500 sm:text-[0.65rem]">
                {n === 0 ? '—' : `${n}`}
                <span className="hidden sm:inline">
                  {n === 0 ? ' Quiet' : ` ship${n === 1 ? '' : 's'}`}
                </span>
              </span>
              {n > 0 && (
                <span className="mt-0.5 hidden text-[0.65rem] tabular-nums text-channel-700 sm:block">
                  {day.scheduledPassengers.toLocaleString()}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <ul className="divide-y divide-fog-200 rounded-2xl border border-fog-200 bg-white/80">
        {Array.from({ length: dim }, (_, i) => {
          const iso = `${year}-${String(mi + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
          const day = getDay(iso)
          const n = day.ships.filter((s) => !s.cancelled).length
          return (
            <li key={iso}>
              <Link
                to={`/schedule/${iso}`}
                className="flex min-h-12 flex-wrap items-center justify-between gap-2 px-3 py-3 no-underline hover:bg-fog-50 sm:px-4"
              >
                <span className="text-sm font-semibold text-spruce-900 sm:text-base">
                  {iso.slice(8)} · {n === 0 ? 'No ships' : `${n} ships`}
                </span>
                <span className="text-xs tabular-nums text-fog-600 sm:text-sm">
                  {day.scheduledPassengers.toLocaleString()} pax
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
