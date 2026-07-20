import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo/jsonld'
import { buildMeta } from '../lib/seo/meta'

export function ApiPage() {
  const meta = buildMeta({ type: 'api' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Data access', path: '/api' },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Seo
        meta={meta}
        jsonLd={[organizationJsonLd(), websiteJsonLd(), breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="font-display text-3xl font-semibold text-spruce-900">{meta.h1}</h1>
      <p className="text-fog-700 leading-relaxed">
        A documented public HTTP API is not opened yet. Researchers and journalists can
        download season CSV from{' '}
        <Link to="/stats" className="font-semibold text-channel-700">
          /stats
        </Link>{' '}
        and read methodology on{' '}
        <Link to="/data-sources" className="font-semibold text-channel-700">
          /data-sources
        </Link>
        .
      </p>
      <p className="text-fog-700 leading-relaxed">
        The site also exposes a bundled{' '}
        <a href="/ship_visits.json" className="font-semibold text-channel-700">
          ship_visits.json
        </a>{' '}
        snapshot for offline/fallback use. Treat it as unofficial schedule data; confirm
        against the Port PDF for operational decisions.
      </p>
      <p className="text-sm text-fog-500">
        Paths under <code className="text-fog-700">/api/</code> in robots.txt are reserved
        and disallowed for crawling until a stable public API ships.
      </p>
    </div>
  )
}
