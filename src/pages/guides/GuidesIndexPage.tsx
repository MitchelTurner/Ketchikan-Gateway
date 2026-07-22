import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { GUIDES } from '../../data/guides'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'

export function GuidesIndexPage() {
  const meta = buildMeta({ type: 'guides' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
  ]

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
      <ul className="grid gap-4 md:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              to={`/guides/${g.slug}`}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-fog-200 bg-white/80 no-underline transition hover:border-channel-400"
            >
              <img
                src={g.hero.src}
                alt=""
                width={700}
                height={400}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="flex flex-1 flex-col px-5 py-4">
                <h2 className="font-display text-xl font-semibold text-spruce-900">
                  {g.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-fog-600">{g.description}</p>
                <p className="mt-3 text-xs text-fog-400">{g.readMinutes} min read</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-fog-600">
        Start with{' '}
        <Link
          to="/guides/things-to-do-in-ketchikan"
          className="font-semibold text-channel-700"
        >
          Things to Do in Ketchikan Alaska
        </Link>{' '}
        for the attractions list, or open{' '}
        <Link to="/activities" className="font-semibold text-channel-700">
          Activities
        </Link>{' '}
        for quieter stops ranked by today’s crowd.
      </p>
    </div>
  )
}
