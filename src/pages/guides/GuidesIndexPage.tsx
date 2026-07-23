import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { GuideLiveModule } from '../../components/guides/GuideLiveModule'
import { Seo } from '../../components/Seo'
import {
  GUIDES,
  getFeaturedGuide,
  type Guide,
  type GuideAudience,
  type GuideTag,
} from '../../data/guides'
import { useGateway } from '../../hooks/GatewayContext'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { CROWD_META, todayInAlaska } from '../../lib/utils'

const TAG_LABEL: Record<GuideTag, string> = {
  'port-day': 'Port day',
  planning: 'Planning',
  berths: 'Berths',
  tours: 'Tours',
  crowds: 'Crowds',
}

const INTENTS: {
  id: string
  label: string
  description: string
  audience: GuideAudience
  href: string
}[] = [
  {
    id: 'cruise',
    label: 'Cruise passenger',
    description: 'Port-day attractions, tours, and timing',
    audience: 'cruise',
    href: '/guides/things-to-do-in-ketchikan',
  },
  {
    id: 'planner',
    label: 'Planning a trip',
    description: 'Best days and quieter weeks',
    audience: 'planner',
    href: '/guides/best-time-to-visit-ketchikan',
  },
  {
    id: 'local',
    label: 'Local / business',
    description: 'Berths, crowds, and errand timing',
    audience: 'local',
    href: '/guides/ketchikan-berth-locations-explained',
  },
]

function GuideCard({
  guide,
  featured = false,
}: {
  guide: Guide
  featured?: boolean
}) {
  return (
    <Link
      to={`/guides/${guide.slug}`}
      className={[
        'flex h-full flex-col overflow-hidden border border-fog-200 bg-white/80 no-underline transition hover:border-channel-400',
        featured ? 'rounded-2xl md:flex-row' : 'rounded-2xl',
      ].join(' ')}
    >
      <img
        src={guide.hero.src}
        alt=""
        width={700}
        height={400}
        loading="lazy"
        decoding="async"
        className={
          featured
            ? 'aspect-[16/10] w-full object-cover md:aspect-auto md:h-auto md:w-[44%] md:min-h-[14rem]'
            : 'aspect-[16/9] w-full object-cover'
        }
      />
      <div className="flex flex-1 flex-col px-5 py-4">
        {featured && (
          <p className="text-[0.65rem] font-semibold tracking-wider text-channel-700 uppercase">
            Featured guide
          </p>
        )}
        <h2
          className={[
            'font-display font-semibold text-spruce-900',
            featured ? 'mt-1 text-2xl sm:text-3xl' : 'text-xl',
          ].join(' ')}
        >
          {guide.title}
        </h2>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {guide.tags.map((t) => (
            <li
              key={t}
              className="rounded bg-fog-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-fog-700"
            >
              {TAG_LABEL[t]}
            </li>
          ))}
        </ul>
        <p className="mt-2 flex-1 text-sm text-fog-600">{guide.description}</p>
        <p className="mt-3 text-xs text-fog-400">{guide.readMinutes} min read</p>
      </div>
    </Link>
  )
}

export function GuidesIndexPage() {
  const meta = buildMeta({ type: 'guides' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
  ]
  const featured = getFeaturedGuide()
  const rest = GUIDES.filter((g) => g.slug !== featured?.slug)
  const { getDay } = useGateway()
  const today = getDay(todayInAlaska())
  const ships = today.ships.filter((s) => !s.cancelled).length
  const crowd = CROWD_META[today.weatherAdjustedCrowd]
  const busy =
    today.weatherAdjustedCrowd === 'busy' || today.weatherAdjustedCrowd === 'extreme'

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
          Things to do, attractions, and crowd-aware planning for cruise passengers and
          locals — always linked back to the live schedule data.
        </p>
      </header>

      <p className="rounded-xl border border-channel-200 bg-channel-50/70 px-4 py-3 text-sm text-spruce-900">
        <strong className="font-semibold">Based on today:</strong> {crowd.label} crowd ·{' '}
        {ships} ship{ships === 1 ? '' : 's'}.{' '}
        {busy ? (
          <>
            Start with{' '}
            <Link
              to="/guides/things-to-do-in-ketchikan"
              className="font-semibold text-channel-700"
            >
              Things to Do
            </Link>{' '}
            and book an early tour away from the docks.
          </>
        ) : (
          <>
            Good day to DIY — see{' '}
            <Link
              to="/guides/things-to-do-in-ketchikan"
              className="font-semibold text-channel-700"
            >
              Things to Do
            </Link>{' '}
            or the{' '}
            <Link to={`/schedule/${todayInAlaska()}`} className="font-semibold text-channel-700">
              day page
            </Link>
            .
          </>
        )}
      </p>

      <section aria-labelledby="intent-heading" className="space-y-3">
        <h2 id="intent-heading" className="font-display text-lg font-semibold text-spruce-900">
          What are you here for?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {INTENTS.map((intent) => (
            <li key={intent.id}>
              <Link
                to={intent.href}
                className="flex h-full flex-col rounded-2xl border border-fog-200 bg-white/80 px-4 py-4 no-underline transition hover:border-channel-400"
              >
                <span className="font-semibold text-spruce-900">{intent.label}</span>
                <span className="mt-1 text-sm text-fog-600">{intent.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <GuideLiveModule showActivities />

      {featured && (
        <section aria-labelledby="featured-heading" className="space-y-3">
          <h2 id="featured-heading" className="sr-only">
            Featured guide
          </h2>
          <GuideCard guide={featured} featured />
        </section>
      )}

      <section aria-labelledby="more-guides-heading" className="space-y-3">
        <h2
          id="more-guides-heading"
          className="font-display text-lg font-semibold text-spruce-900"
        >
          More guides
        </h2>
        <ul className="grid gap-4 md:grid-cols-1">
          {rest.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-fog-600">
        Want live go-now tips by spot?{' '}
        <Link to="/activities" className="font-semibold text-channel-700">
          Activities
        </Link>{' '}
        ranks quieter stops by today’s crowd.
      </p>
    </div>
  )
}
