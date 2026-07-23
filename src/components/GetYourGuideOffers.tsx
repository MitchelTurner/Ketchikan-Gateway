import { useMemo, useState } from 'react'
import {
  GYG_BROWSE_LINKS,
  GYG_DESTINATION_CTA,
  GYG_OFFERS,
  type GygCategory,
} from '../data/getyourguideOffers'
import { getGygPartnerId, gygUrl } from '../lib/getyourguide'

const CATEGORY_LABEL: Record<GygCategory, string> = {
  culture: 'Culture',
  wildlife: 'Wildlife',
  adventure: 'Adventure',
  food: 'Food',
  flight: 'Flightseeing',
  water: 'On the water',
  show: 'Shows',
}

const FILTERS: { id: 'all' | GygCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'culture', label: 'Culture' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'water', label: 'Water' },
  { id: 'flight', label: 'Flights' },
  { id: 'food', label: 'Food' },
  { id: 'show', label: 'Shows' },
]

type Props = {
  /** Campaign tag for GetYourGuide cmp= tracking */
  campaign?: string
  /** Limit featured cards; default shows all curated offers */
  limit?: number
  /** Show category filter chips (default true when not limited) */
  showFilters?: boolean
}

/**
 * Affiliate content area: curated Things to Do in Ketchikan experiences
 * with GetYourGuide deep links (partner_id from VITE_GETYOURGUIDE_PARTNER_ID).
 */
export function GetYourGuideOffers({
  campaign = 'ktn-things-to-do',
  limit,
  showFilters,
}: Props) {
  const partnerId = getGygPartnerId()
  const [filter, setFilter] = useState<'all' | GygCategory>('all')
  const filtersEnabled = showFilters ?? limit == null

  const offers = useMemo(() => {
    const base =
      filter === 'all' ? GYG_OFFERS : GYG_OFFERS.filter((o) => o.category === filter)
    return limit ? base.slice(0, limit) : base
  }, [filter, limit])

  const hubHref = gygUrl(GYG_DESTINATION_CTA.path, { campaign })

  return (
    <section
      aria-labelledby="gyg-offers-heading"
      className="space-y-4 rounded-2xl border border-channel-200/80 bg-gradient-to-br from-white/90 to-channel-50/50 p-4 sm:p-5"
    >
      <div className="space-y-2">
        <p className="text-[0.65rem] font-semibold tracking-wider text-channel-700 uppercase">
          Bookable experiences
        </p>
        <h2
          id="gyg-offers-heading"
          className="font-display text-xl font-semibold text-spruce-900 sm:text-2xl"
        >
          Things to do in Ketchikan — tours & shore excursions
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-fog-600">
          {GYG_OFFERS.length}+ hand-picked GetYourGuide activities — culture, wildlife,
          rainforest, water, food, and shows. Check your ship’s arrival on the KTN Port day
          page, then book an early or late slot when downtown is busiest.
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {GYG_BROWSE_LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={gygUrl(link.path, { campaign: `${campaign}-browse-${link.id}` })}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex rounded-full border border-channel-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-channel-800 no-underline transition hover:border-channel-500 hover:bg-channel-50"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {filtersEnabled && (
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Filter tours by category"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={[
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                  active
                    ? 'bg-spruce-900 text-fog-50'
                    : 'bg-white/80 text-fog-700 ring-1 ring-fog-200 hover:ring-channel-400',
                ].join(' ')}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {offers.map((offer) => {
          const href = gygUrl(offer.path, { campaign: `${campaign}-${offer.id}` })
          return (
            <li key={offer.id}>
              <a
                href={href}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-fog-200 bg-white/90 no-underline transition hover:border-channel-400"
              >
                <img
                  src={offer.imageSrc}
                  alt=""
                  width={700}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="flex flex-1 flex-col gap-2 px-3.5 py-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-medium text-fog-500">
                    <span className="rounded bg-fog-100 px-1.5 py-0.5 text-fog-700">
                      {CATEGORY_LABEL[offer.category]}
                    </span>
                    <span>{offer.duration}</span>
                    <span className="tabular-nums text-spruce-800">{offer.fromPrice}</span>
                  </div>
                  <h3 className="font-semibold leading-snug text-spruce-900 group-hover:text-channel-800">
                    {offer.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-fog-600">
                    {offer.blurb}
                  </p>
                  <p className="text-xs leading-snug text-channel-800/90">
                    Crowd tip: {offer.crowdTip}
                  </p>
                  <span className="mt-1 text-sm font-semibold text-channel-700">
                    View on GetYourGuide →
                  </span>
                </div>
              </a>
            </li>
          )
        })}
      </ul>

      {offers.length === 0 && (
        <p className="text-sm text-fog-600">
          No tours in this category yet — try All, or{' '}
          <a
            href={hubHref}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="font-semibold text-channel-700"
          >
            browse GetYourGuide
          </a>
          .
        </p>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-spruce-900/10 bg-spruce-950 px-4 py-4 text-fog-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold text-white">
            {GYG_DESTINATION_CTA.title}
          </p>
          <p className="mt-1 text-sm text-fog-300">{GYG_DESTINATION_CTA.blurb}</p>
        </div>
        <a
          href={hubHref}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-channel-400 px-4 py-2.5 text-sm font-semibold text-spruce-950 no-underline transition hover:bg-channel-300"
        >
          Open Ketchikan tours
        </a>
      </div>

      <p className="text-[0.7rem] leading-relaxed text-fog-500">
        Affiliate disclosure: KTN Port may earn a commission if you book through GetYourGuide
        links on this page, at no extra cost to you. Prices and availability are set by
        GetYourGuide and can change.
        {import.meta.env.DEV && !partnerId && (
          <>
            {' '}
            <span className="text-fog-400">
              Dev: set <code className="rounded bg-fog-100 px-1">VITE_GETYOURGUIDE_PARTNER_ID</code>{' '}
              to attach tracking.
            </span>
          </>
        )}
      </p>
    </section>
  )
}
