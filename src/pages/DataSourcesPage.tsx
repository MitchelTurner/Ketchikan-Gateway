import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { PORT_SOURCES } from '../lib/portSources'
import {
  breadcrumbJsonLd,
  datasetJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo/jsonld'
import { buildMeta } from '../lib/seo/meta'

export function DataSourcesPage() {
  const meta = buildMeta({ type: 'dataSources' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Data sources', path: '/data-sources' },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <Seo
        meta={meta}
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd(crumbs),
          datasetJsonLd({
            name: 'Ketchikan cruise passenger traffic dataset',
            description:
              'Compiled daily cruise ship calls, berths, and passenger capacity for Ketchikan with weather-adjusted downtown predictions.',
            path: '/data-sources',
            temporalCoverage: '2026-05-01/2026-10-31',
          }),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <header>
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          {meta.h1}
        </h1>
        <p className="mt-2 text-fog-600">
          Transparency for search engines, AI answer engines, journalists, and anyone
          trusting a crowd number before they walk downtown.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Schedule & capacity
        </h2>
        <p className="text-fog-700 leading-relaxed">
          Primary berthing and daily passenger capacity figures are taken from Port of
          Ketchikan / City of Ketchikan published calendars (PDF). Operators can refresh the
          live database from Manage; the public site also ships a bundled fallback JSON.
        </p>
        <ul className="space-y-2">
          {PORT_SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-channel-700"
              >
                {s.title}
              </a>
              <span className="text-sm text-fog-500"> — {s.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Weather & predictions
        </h2>
        <p className="text-fog-700 leading-relaxed">
          Weather comes from Open-Meteo for Ketchikan. The ashore model applies condition-
          based factors, ship-size and berth weights, and an optional calibration bias from
          logged actuals. Predicted passengers ashore are <em>estimates</em>, never published
          as official counts.
        </p>
        <p className="text-fog-700 leading-relaxed">
          Crowd bands: Low ≤3,000 · Moderate ≤6,000 · Busy ≤10,000 · Extreme &gt;10,000
          predicted ashore. Downtown verdict maps those bands to Quiet / Okay / Avoid 10–2.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-spruce-900">Update cadence</h2>
        <p className="text-fog-700 leading-relaxed">
          The public app refreshes schedule and weather about every 10 minutes while open.
          Each data page shows a last-updated timestamp when the client has loaded. Admins
          can mark the schedule checked against the Port PDF; that timestamp appears on Today.
        </p>
      </section>

      <p className="text-sm text-fog-600">
        Download season tables from{' '}
        <Link to="/stats" className="font-semibold text-channel-700">
          Stats
        </Link>
        .
      </p>
    </div>
  )
}
