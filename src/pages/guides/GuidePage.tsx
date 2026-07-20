import { Link, Navigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { getGuide } from '../../data/guides'
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { todayInAlaska } from '../../lib/utils'

export function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  if (!guide) return <Navigate to="/404" replace />

  const meta = buildMeta({
    type: 'guide',
    title: guide.title,
    description: guide.description,
    slug: guide.slug,
  })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ]

  const today = todayInAlaska()

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <Seo
        meta={meta}
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd(crumbs),
          faqJsonLd(guide.faqs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <header>
        <h1 className="font-display text-3xl font-semibold text-spruce-900 sm:text-4xl">
          {meta.h1}
        </h1>
        <p className="mt-3 text-fog-600">{guide.description}</p>
        <p className="mt-2 text-xs text-fog-400">
          Updated {guide.updated} · {guide.readMinutes} min read
        </p>
      </header>

      <p className="rounded-xl border border-channel-200 bg-channel-50/60 px-4 py-3 text-sm text-spruce-900">
        Live data:{' '}
        <Link to={`/schedule/${today}`} className="font-semibold text-channel-700">
          today’s schedule
        </Link>{' '}
        ·{' '}
        <Link to="/schedule" className="font-semibold text-channel-700">
          full calendar
        </Link>{' '}
        ·{' '}
        <Link to="/stats" className="font-semibold text-channel-700">
          season stats
        </Link>
      </p>

      {guide.sections.map((s) => (
        <section key={s.heading} className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-spruce-900">
            {s.heading}
          </h2>
          {s.body.map((p) => (
            <p key={p.slice(0, 40)} className="leading-relaxed text-fog-700">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {guide.faqs.map((f) => (
            <div key={f.question} className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
              <dt className="font-semibold text-spruce-900">{f.question}</dt>
              <dd className="mt-1 text-sm text-fog-700">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  )
}
