import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { BERTH_PLACES } from '../lib/berths'
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo/jsonld'
import { buildMeta } from '../lib/seo/meta'

const FAQS = [
  {
    question: 'Which Ketchikan berths are downtown?',
    answer:
      'Berths 1–4 sit on the downtown waterfront. Guests can walk into Front Street and Creek Street within minutes.',
  },
  {
    question: 'Where is Ward Cove relative to downtown?',
    answer:
      'Ward Cove is north of the downtown core. Ships docking at WW/WE typically rely on shuttles or tours to reach town.',
  },
  {
    question: 'Do anchorage calls still affect downtown crowds?',
    answer:
      'Yes. Guests tender ashore, so volume still reaches town, but peaks are often later and less sharp than pier-side all-calls.',
  },
]

export function BerthsPage() {
  const meta = buildMeta({ type: 'berths' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Berths', path: '/berths' },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo
        meta={meta}
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd(crumbs),
          faqJsonLd(FAQS),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <header>
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          {meta.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-fog-600">
          Which ships dock where changes how crowded downtown feels. Same passenger total,
          different berth mix — different sidewalk pressure.
        </p>
      </header>

      <ul className="space-y-4">
        {BERTH_PLACES.map((b) => (
          <li
            key={b.code}
            className="rounded-2xl border border-fog-200 bg-white/80 px-5 py-4"
          >
            <p className="text-xs font-semibold tracking-wider text-fog-400 uppercase">
              Code {b.code} · {b.area.replace('-', ' ')}
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-spruce-900">
              {b.name}
            </h2>
            <p className="mt-2 text-fog-700">{b.summary}</p>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {FAQS.map((f) => (
            <div key={f.question} className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
              <dt className="font-semibold text-spruce-900">{f.question}</dt>
              <dd className="mt-1 text-sm text-fog-700">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm text-fog-600">
        See berth assignments on any{' '}
        <Link to="/schedule" className="font-semibold text-channel-700">
          schedule day
        </Link>{' '}
        or read{' '}
        <Link
          to="/guides/ketchikan-berth-locations-explained"
          className="font-semibold text-channel-700"
        >
          Berth locations explained
        </Link>
        .
      </p>
    </div>
  )
}
