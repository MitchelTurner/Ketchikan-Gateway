import { GYG_DESTINATION_CTA, GYG_OFFERS } from '../data/getyourguideOffers'
import { getGygPartnerId, gygUrl } from '../lib/getyourguide'

const CATEGORY_LABEL: Record<(typeof GYG_OFFERS)[number]['category'], string> = {
  culture: 'Culture',
  wildlife: 'Wildlife',
  adventure: 'Adventure',
  food: 'Food',
  flight: 'Flightseeing',
  water: 'On the water',
}

type Props = {
  /** Campaign tag for GetYourGuide cmp= tracking */
  campaign?: string
  /** Limit featured cards; default shows all curated offers */
  limit?: number
}

/**
 * Affiliate content area: curated Things to Do in Ketchikan experiences
 * with GetYourGuide deep links (partner_id from VITE_GETYOURGUIDE_PARTNER_ID).
 */
export function GetYourGuideOffers({
  campaign = 'ktn-things-to-do',
  limit,
}: Props) {
  const partnerId = getGygPartnerId()
  const offers = limit ? GYG_OFFERS.slice(0, limit) : GYG_OFFERS
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
          Hand-picked GetYourGuide activities that match the attractions in this guide.
          Check your ship’s arrival on the KTN Port day page, then book an early or late
          slot when downtown is busiest.
        </p>
      </div>

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
