import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { useGateway } from '../../hooks/GatewayContext'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { monthSlug } from '../../lib/seo/slugs'
import { todayInAlaska } from '../../lib/utils'

export function ScheduleHubPage() {
  const { days } = useGateway()
  const meta = buildMeta({ type: 'scheduleHub' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
  ]

  const years = [...new Set(days.map((d) => d.date.slice(0, 4)))].sort()
  const today = todayInAlaska()
  const y = Number(today.slice(0, 4))
  const m = monthSlug(Number(today.slice(5, 7)) - 1)

  const byYearMonth = new Map<string, number>()
  for (const d of days) {
    if (d.ships.length === 0) continue
    const key = d.date.slice(0, 7)
    byYearMonth.set(key, (byYearMonth.get(key) ?? 0) + 1)
  }

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
          Full-season cruise calendar for Ketchikan — open a year, month, or any day for
          ship counts, berths, and downtown crowd forecasts. Times in Alaska time.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/schedule/${today}`}
          className="rounded-full bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50 no-underline"
        >
          Today’s day page
        </Link>
        <Link
          to={`/schedule/${y}/${m}`}
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
        >
          This month
        </Link>
        <Link
          to="/stats"
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
        >
          Season stats
        </Link>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">Years</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {(years.length ? years : [String(y)]).map((year) => (
            <li key={year}>
              <Link
                to={`/schedule/${year}`}
                className="inline-block rounded-full border border-fog-200 bg-white/80 px-4 py-2 text-sm font-semibold text-spruce-900 no-underline hover:border-channel-400"
              >
                {year} calendar
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Months with ship calls
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {[...byYearMonth.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([ym, count]) => {
              const year = ym.slice(0, 4)
              const mi = Number(ym.slice(5, 7)) - 1
              const slug = monthSlug(mi)
              const label = slug.charAt(0).toUpperCase() + slug.slice(1)
              return (
                <li key={ym}>
                  <Link
                    to={`/schedule/${year}/${slug}`}
                    className="flex items-center justify-between rounded-xl border border-fog-200 bg-white/70 px-4 py-3 no-underline hover:border-channel-400"
                  >
                    <span className="font-semibold text-spruce-900">
                      {label} {year}
                    </span>
                    <span className="text-xs text-fog-500">{count} days</span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </section>
    </div>
  )
}
