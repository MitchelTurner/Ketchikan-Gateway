import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AlaskaTimeNote } from '../../components/AlaskaTimeNote'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { ConfidenceBadge } from '../../components/ConfidenceBadge'
import { CrowdMeter } from '../../components/CrowdMeter'
import { DowntownVerdictBanner } from '../../components/DowntownVerdict'
import { HourlyCrowdChart } from '../../components/HourlyCrowdChart'
import { LastUpdatedStamp } from '../../components/LastUpdatedStamp'
import { RainReliefBanner } from '../../components/RainReliefBanner'
import { ScheduleTable } from '../../components/ScheduleTable'
import { Seo } from '../../components/Seo'
import { ShareDayButton } from '../../components/ShareDayButton'
import { WeatherPanel } from '../../components/WeatherPanel'
import { useGateway } from '../../hooks/GatewayContext'
import { dayContextualProse, dayOneLiner } from '../../lib/seo/dayCopy'
import {
  breadcrumbJsonLd,
  dayEventsJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { isIsoDate, monthSlug } from '../../lib/seo/slugs'
import { addDays, formatLongDate, todayInAlaska } from '../../lib/utils'

function monthsAhead(iso: string): number {
  const today = todayInAlaska()
  const t = new Date(`${today}T12:00:00`)
  const d = new Date(`${iso}T12:00:00`)
  return (d.getFullYear() - t.getFullYear()) * 12 + (d.getMonth() - t.getMonth())
}

export function ScheduleDayPage() {
  const { date: raw = '' } = useParams()
  const { getDay, days, lastUpdated, loading } = useGateway()

  const seasonAvg = useMemo(() => {
    const withShips = days.filter((d) => d.scheduledPassengers > 0)
    if (withShips.length === 0) return 0
    return (
      withShips.reduce((s, d) => s + d.scheduledPassengers, 0) / withShips.length
    )
  }, [days])

  if (raw === 'today') return <Navigate to="/" replace />
  if (raw === 'tomorrow') {
    return <Navigate to={`/schedule/${addDays(todayInAlaska(), 1)}`} replace />
  }

  if (!isIsoDate(raw)) {
    return <Navigate to="/404" replace />
  }

  const date = raw
  const day = getDay(date)
  const active = day.ships.filter((s) => !s.cancelled)
  const unpublishedFar =
    monthsAhead(date) > 18 && day.ships.length === 0 && !loading

  const y = Number(date.slice(0, 4))
  const m = Number(date.slice(5, 7)) - 1
  const mSlug = monthSlug(m)
  const prev = addDays(date, -1)
  const next = addDays(date, 1)
  const one = dayOneLiner(day)
  const prose = dayContextualProse(day, seasonAvg)

  const meta = buildMeta({
    type: 'day',
    date,
    shipCount: active.length,
    passengers: day.scheduledPassengers,
    noindex: unpublishedFar,
  })

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: String(y), path: `/schedule/${y}` },
    { name: mSlug.charAt(0).toUpperCase() + mSlug.slice(1), path: `/schedule/${y}/${mSlug}` },
    { name: formatLongDate(date), path: `/schedule/${date}` },
  ]

  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    breadcrumbJsonLd(crumbs),
    ...dayEventsJsonLd(day),
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 overflow-x-clip px-3 py-6 sm:space-y-8 sm:px-4 sm:py-10">
      <Seo
        meta={{
          ...meta,
          dateModified: lastUpdated?.toISOString(),
        }}
        jsonLd={jsonLd}
      />

      <Breadcrumbs items={crumbs} />

      <header className="space-y-3">
        <h1 className="font-display text-2xl font-semibold leading-tight text-spruce-900 sm:text-4xl">
          {meta.h1}
        </h1>
        <p className="max-w-3xl text-base text-fog-700 sm:text-lg">
          <strong className="font-semibold text-spruce-900">{one.lead}</strong>
          {one.rest}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <AlaskaTimeNote />
          <LastUpdatedStamp at={lastUpdated} />
          <ShareDayButton day={day} compact />
        </div>
      </header>

      <ScheduleTable
        ships={day.ships}
        date={date}
        caption={`Cruise ship schedule for ${formatLongDate(date)}`}
      />

      {active.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <CrowdMeter
              level={day.weatherAdjustedCrowd}
              passengers={day.predictedDowntown}
              label="Downtown busyness (weather-adjusted)"
            />
            {day.weather && <WeatherPanel weather={day.weather} />}
          </div>
          <p className="text-sm text-fog-600">
            Busyness bands: Low ≤3k ashore, Moderate ≤6k, Busy ≤10k, Extreme &gt;10k.
            Methodology on{' '}
            <Link to="/data-sources" className="font-semibold text-channel-700">
              Data sources
            </Link>
            .
          </p>
          <DowntownVerdictBanner day={day} />
          <RainReliefBanner day={day} />
          <ConfidenceBadge day={day} />
          {day.hourlyCrowd.length > 0 && (
            <div className="min-h-[16rem]">
              <HourlyCrowdChart points={day.hourlyCrowd} peakHour={day.peakHour} />
            </div>
          )}
        </>
      )}

      <section className="max-w-3xl space-y-3 text-base leading-relaxed text-fog-700">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          What this day means downtown
        </h2>
        <p>{prose}</p>
        <p className="text-sm text-fog-500">
          Unofficial tool — schedules change. Estimated passenger counts are labeled as
          estimates. See{' '}
          <Link to="/about" className="text-channel-700 underline-offset-2 hover:underline">
            About
          </Link>{' '}
          and{' '}
          <Link
            to="/data-sources"
            className="text-channel-700 underline-offset-2 hover:underline"
          >
            data sources
          </Link>
          .
        </p>
      </section>

      <nav
        className="flex flex-wrap items-center justify-between gap-3 border-t border-fog-200 pt-6"
        aria-label="Day navigation"
      >
        <Link
          to={`/schedule/${prev}`}
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
        >
          ← {formatLongDate(prev)}
        </Link>
        <Link
          to={`/schedule/${y}/${mSlug}`}
          className="text-sm font-semibold text-channel-700 no-underline hover:underline"
        >
          {mSlug.charAt(0).toUpperCase() + mSlug.slice(1)} {y} calendar
        </Link>
        <Link
          to={`/schedule/${next}`}
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
        >
          {formatLongDate(next)} →
        </Link>
      </nav>

      <p className="text-sm text-fog-600">
        Planning tip:{' '}
        <Link
          to="/guides/best-time-to-visit-ketchikan"
          className="font-semibold text-channel-700"
        >
          Best time to visit without crowds
        </Link>
        .
      </p>
    </div>
  )
}
