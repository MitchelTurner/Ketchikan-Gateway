import { Link, Navigate, useParams } from 'react-router-dom'
import { AlaskaTimeNote } from '../../components/AlaskaTimeNote'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { useGateway } from '../../hooks/GatewayContext'
import { resolveBerthPlace } from '../../lib/berths'
import { shipCapacity } from '../../lib/prediction'
import { inferLineProfile, LINE_PROFILE_META } from '../../lib/shipProfiles'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  shipCallEventJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import {
  displayShipName,
  SHIP_SLUG_REDIRECTS,
  shipSlug,
} from '../../lib/seo/slugs'
import { formatLongDate, todayInAlaska } from '../../lib/utils'

export function ShipDetailPage() {
  const { slug = '' } = useParams()
  const { days, loading } = useGateway()

  if (SHIP_SLUG_REDIRECTS[slug]) {
    return <Navigate to={`/ships/${SHIP_SLUG_REDIRECTS[slug]}`} replace />
  }

  const visits = days
    .flatMap((d) => d.ships)
    .filter((s) => shipSlug(s.ship) === slug)
    .sort((a, b) => a.date.localeCompare(b.date))

  if (!loading && visits.length === 0) {
    return <Navigate to="/404" replace />
  }

  if (loading && visits.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-fog-600">Loading ship…</div>
    )
  }

  const name = visits[0].ship
  const capacity = Math.max(...visits.map(shipCapacity))
  const year = Number(todayInAlaska().slice(0, 4))
  const yearCalls = visits.filter((v) => v.date.startsWith(String(year)))
  const berthCounts = new Map<string, number>()
  for (const v of visits) {
    if (!v.berth) continue
    berthCounts.set(v.berth, (berthCounts.get(v.berth) ?? 0) + 1)
  }
  const typicalBerth =
    [...berthCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const profile = LINE_PROFILE_META[inferLineProfile(name)]

  const upcoming = visits.filter((v) => v.date >= todayInAlaska() && !v.cancelled)
  const historical = visits.filter((v) => v.date < todayInAlaska())

  const meta = buildMeta({
    type: 'ship',
    shipName: name,
    capacity,
    callCount: yearCalls.length || visits.length,
    year,
  })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Ships', path: '/ships' },
    { name: displayShipName(name), path: `/ships/${slug}` },
  ]

  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    breadcrumbJsonLd(crumbs),
    ...visits.filter((v) => !v.cancelled).slice(0, 40).map(shipCallEventJsonLd),
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo meta={meta} jsonLd={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          {meta.h1}
        </h1>
        <p className="max-w-2xl text-fog-600">
          Estimated capacity up to {capacity.toLocaleString()} passengers
          {typicalBerth !== '—'
            ? ` · most often at ${resolveBerthPlace(typicalBerth).name}`
            : ''}
          . Line style: {profile.label.toLowerCase()}. Original schedule summary — not
          cruise-line marketing copy.
        </p>
        <AlaskaTimeNote />
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Season calls', value: String(yearCalls.length || visits.length) },
          { label: 'Capacity (est.)', value: capacity.toLocaleString() },
          { label: 'Typical berth', value: typicalBerth },
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
          Upcoming calls
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-fog-600">
            No upcoming calls in the loaded schedule. Historical calls remain below.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-fog-200 rounded-2xl border border-fog-200 bg-white/80">
            {upcoming.map((v) => (
              <li key={v.id}>
                <Link
                  to={`/schedule/${v.date}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 no-underline hover:bg-fog-50"
                >
                  <span className="font-semibold text-spruce-900">
                    {formatLongDate(v.date)}
                  </span>
                  <span className="text-sm text-fog-600">
                    {v.arrival}–{v.departure} · berth {v.berth || '—'} ·{' '}
                    {shipCapacity(v).toLocaleString()} pax
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {historical.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-spruce-900">
            Recent historical calls
          </h2>
          <ul className="mt-3 divide-y divide-fog-200 rounded-2xl border border-fog-200 bg-white/80">
            {historical
              .slice(-15)
              .reverse()
              .map((v) => (
                <li key={v.id}>
                  <Link
                    to={`/schedule/${v.date}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 no-underline hover:bg-fog-50"
                  >
                    <span className="font-semibold text-spruce-900">
                      {formatLongDate(v.date)}
                    </span>
                    <span className="text-sm text-fog-600">
                      {v.arrival}–{v.departure} · berth {v.berth || '—'}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-fog-600">
        Berth codes explained on the{' '}
        <Link to="/berths" className="font-semibold text-channel-700">
          berths page
        </Link>
        .
      </p>
    </div>
  )
}
