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
import { isYear, monthSlug } from '../../lib/seo/slugs'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function ScheduleYearPage() {
  const params = useParams()
  // Supports /schedule/:year and /schedule/:date when :date is a year
  const yearParam = params.year ?? params.date ?? ''
  const { days } = useGateway()

  if (!isYear(yearParam)) return <Navigate to="/404" replace />
  const year = Number(yearParam)
  const meta = buildMeta({ type: 'year', year })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: String(year), path: `/schedule/${year}` },
  ]

  const yearDays = days.filter((d) => d.date.startsWith(`${year}-`))
  const monthCounts = Array.from({ length: 12 }, (_, mi) => {
    const mm = String(mi + 1).padStart(2, '0')
    const subset = yearDays.filter((d) => d.date.slice(5, 7) === mm)
    const pax = subset.reduce((s, d) => s + d.scheduledPassengers, 0)
    const visits = subset.reduce(
      (s, d) => s + d.ships.filter((x) => !x.cancelled).length,
      0,
    )
    return { mi, pax, visits, daysWithShips: subset.filter((d) => d.ships.length).length }
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo
        meta={meta}
        jsonLd={[organizationJsonLd(), websiteJsonLd(), breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <header>
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          {meta.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-fog-600">
          Month-by-month cruise calls and passenger capacity for the {year} Ketchikan
          season. Open a month for every day page.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {monthCounts.map(({ mi, pax, visits, daysWithShips }) => (
          <li key={mi}>
            <Link
              to={`/schedule/${year}/${monthSlug(mi)}`}
              className="block rounded-2xl border border-fog-200 bg-white/80 px-4 py-4 no-underline transition hover:border-channel-400"
            >
              <p className="font-display text-xl font-semibold text-spruce-900">
                {MONTH_NAMES[mi]} {year}
              </p>
              <p className="mt-2 text-sm text-fog-600">
                {daysWithShips} ship days · {visits} calls
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-channel-700">
                {pax.toLocaleString()}
              </p>
              <p className="text-xs text-fog-500">scheduled passenger capacity</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-sm text-fog-600">
        See also{' '}
        <Link to={`/stats/${year}`} className="font-semibold text-channel-700">
          {year} season statistics
        </Link>
        .
      </p>
    </div>
  )
}
