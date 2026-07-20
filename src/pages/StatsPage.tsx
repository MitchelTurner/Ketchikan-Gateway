import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { LastUpdatedStamp } from '../components/LastUpdatedStamp'
import { Seo } from '../components/Seo'
import { useGateway } from '../hooks/GatewayContext'
import {
  breadcrumbJsonLd,
  datasetJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo/jsonld'
import { buildMeta } from '../lib/seo/meta'
import { monthSlug } from '../lib/seo/slugs'
import { formatLongDate, todayInAlaska } from '../lib/utils'

export function StatsPage() {
  const { year: yearParam } = useParams()
  const { days, lastUpdated } = useGateway()
  const year = yearParam ? Number(yearParam) : Number(todayInAlaska().slice(0, 4))

  const scoped = useMemo(
    () => days.filter((d) => d.date.startsWith(`${year}-`)),
    [days, year],
  )

  const totals = useMemo(() => {
    const visits = scoped.reduce(
      (s, d) => s + d.ships.filter((x) => !x.cancelled).length,
      0,
    )
    const pax = scoped.reduce((s, d) => s + d.scheduledPassengers, 0)
    const busiest = [...scoped].sort(
      (a, b) => b.scheduledPassengers - a.scheduledPassengers,
    )
    const byMonth = Array.from({ length: 12 }, (_, mi) => {
      const mm = String(mi + 1).padStart(2, '0')
      const subset = scoped.filter((d) => d.date.slice(5, 7) === mm)
      return {
        mi,
        pax: subset.reduce((s, d) => s + d.scheduledPassengers, 0),
        visits: subset.reduce(
          (s, d) => s + d.ships.filter((x) => !x.cancelled).length,
          0,
        ),
      }
    })
    return { visits, pax, busiest: busiest.slice(0, 10), byMonth }
  }, [scoped])

  const meta = buildMeta({ type: 'stats', year })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Stats', path: '/stats' },
    ...(yearParam
      ? [{ name: String(year), path: `/stats/${year}` }]
      : []),
  ]

  const downloadCsv = () => {
    const header = 'date,ships,scheduled_passengers,predicted_ashore,crowd_level,verdict\n'
    const rows = scoped
      .map((d) =>
        [
          d.date,
          d.ships.filter((s) => !s.cancelled).length,
          d.scheduledPassengers,
          d.predictedDowntown,
          d.weatherAdjustedCrowd,
          d.verdictLabel,
        ].join(','),
      )
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ktnport-ketchikan-cruise-stats-${year}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    breadcrumbJsonLd(crumbs),
    datasetJsonLd({
      name: `Ketchikan cruise passenger traffic ${year}`,
      description:
        'Daily scheduled cruise passenger capacity and weather-adjusted downtown predictions for Ketchikan, Alaska.',
      path: yearParam ? `/stats/${year}` : '/stats',
      temporalCoverage: `${year}-05-01/${year}-10-31`,
      dateModified: lastUpdated?.toISOString(),
    }),
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo
        meta={{ ...meta, dateModified: lastUpdated?.toISOString() }}
        jsonLd={jsonLd}
      />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          {meta.h1}
        </h1>
        <p className="max-w-2xl text-fog-600">
          Season totals and busiest days from the loaded Port calendar. Passenger figures
          are scheduled capacity estimates unless actuals are logged.
        </p>
        <LastUpdatedStamp at={lastUpdated} />
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={downloadCsv}
          className="rounded-full bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50"
        >
          Download CSV
        </button>
        <Link
          to={`/schedule/${year}`}
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
        >
          {year} schedule
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Ship calls', value: totals.visits.toLocaleString() },
          { label: 'Scheduled capacity', value: totals.pax.toLocaleString() },
          {
            label: 'Days with ships',
            value: String(scoped.filter((d) => d.ships.length > 0).length),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-fog-200 bg-white/70 px-4 py-4"
          >
            <p className="text-[0.7rem] font-semibold tracking-wide text-fog-400 uppercase">
              {s.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-spruce-900">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Busiest days
        </h2>
        <ol className="mt-3 divide-y divide-fog-200 rounded-2xl border border-fog-200 bg-white/80">
          {totals.busiest.map((d, i) => (
            <li key={d.date}>
              <Link
                to={`/schedule/${d.date}`}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 no-underline hover:bg-fog-50"
              >
                <span className="font-semibold text-spruce-900">
                  #{i + 1} · {formatLongDate(d.date)}
                </span>
                <span className="text-sm tabular-nums text-fog-600">
                  {d.scheduledPassengers.toLocaleString()} scheduled · {d.verdictLabel}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Month-by-month passengers
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {totals.byMonth
            .filter((m) => m.pax > 0 || m.visits > 0)
            .map((m) => {
              const slug = monthSlug(m.mi)
              return (
                <li key={m.mi}>
                  <Link
                    to={`/schedule/${year}/${slug}`}
                    className="flex items-center justify-between rounded-xl border border-fog-200 bg-white/70 px-4 py-3 no-underline hover:border-channel-400"
                  >
                    <span className="font-semibold text-spruce-900">
                      {slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </span>
                    <span className="text-sm tabular-nums text-fog-600">
                      {m.pax.toLocaleString()} pax · {m.visits} calls
                    </span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </section>
    </div>
  )
}
