import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { useGateway } from '../../hooks/GatewayContext'
import { shipCapacity } from '../../lib/prediction'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { displayShipName, shipSlug } from '../../lib/seo/slugs'

export function ShipsIndexPage() {
  const { days } = useGateway()
  const meta = buildMeta({ type: 'ships' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Ships', path: '/ships' },
  ]

  const map = new Map<
    string,
    { calls: number; capacity: number; nextDate: string | null }
  >()
  for (const day of days) {
    for (const s of day.ships) {
      if (s.cancelled) continue
      const cur = map.get(s.ship) ?? { calls: 0, capacity: 0, nextDate: null }
      cur.calls += 1
      cur.capacity = Math.max(cur.capacity, shipCapacity(s))
      if (!cur.nextDate || s.date < cur.nextDate) {
        // keep earliest for "first seen"; we'll sort by name for index
      }
      if (!cur.nextDate || s.date > (cur.nextDate ?? '')) {
        cur.nextDate = s.date
      }
      map.set(s.ship, cur)
    }
  }

  const ships = [...map.entries()].sort(([a], [b]) => a.localeCompare(b))

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
          {ships.length} vessels in the current schedule feed. Open a ship for every
          Ketchikan call, typical berth, and capacity.
        </p>
      </header>

      <ul className="divide-y divide-fog-200 overflow-hidden rounded-2xl border border-fog-200 bg-white/80">
        {ships.map(([name, info]) => (
          <li key={name}>
            <Link
              to={`/ships/${shipSlug(name)}`}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 no-underline hover:bg-fog-50"
            >
              <span className="font-display text-lg font-semibold text-spruce-900">
                {displayShipName(name)}
              </span>
              <span className="text-sm text-fog-600">
                {info.calls} calls · up to {info.capacity.toLocaleString()} pax
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
