import { Link, Navigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { getGuide, type GuideImage } from '../../data/guides'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { todayInAlaska } from '../../lib/utils'

function GuideFigure({ image, priority = false }: { image: GuideImage; priority?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-fog-200 bg-fog-50">
      <img
        src={image.src}
        alt={image.alt}
        width={1400}
        height={900}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="aspect-[16/10] w-full object-cover"
      />
      <figcaption className="px-3 py-2 text-[0.7rem] leading-snug text-fog-500">
        {image.creditUrl ? (
          <a
            href={image.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fog-500 underline-offset-2 hover:text-channel-700 hover:underline"
          >
            {image.credit}
          </a>
        ) : (
          image.credit
        )}
      </figcaption>
    </figure>
  )
}

export function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  if (!guide) return <Navigate to="/404" replace />

  const meta = buildMeta({
    type: 'guide',
    title: guide.title,
    description: guide.description,
    slug: guide.slug,
    image: guide.hero.src,
    dateModified: guide.updated,
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
          articleJsonLd({
            title: guide.title,
            description: guide.description,
            path: `/guides/${guide.slug}`,
            dateModified: guide.updated,
            image: guide.hero.src,
          }),
          faqJsonLd(guide.faqs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-4">
        <h1 className="font-display text-3xl font-semibold text-spruce-900 sm:text-4xl">
          {meta.h1}
        </h1>
        <p className="text-fog-600">{guide.description}</p>
        <p className="text-xs text-fog-400">
          Updated {guide.updated} · {guide.readMinutes} min read
        </p>
        <GuideFigure image={guide.hero} priority />
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
        {guide.slug === 'things-to-do-in-ketchikan' && (
          <>
            {' '}
            ·{' '}
            <Link to="/activities" className="font-semibold text-channel-700">
              activities by today’s crowd
            </Link>
          </>
        )}
      </p>

      {guide.sections.map((s) => (
        <section key={s.heading} className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-spruce-900">
            {s.heading}
          </h2>
          {s.image && <GuideFigure image={s.image} />}
          {s.body.map((p) => (
            <p key={p.slice(0, 40)} className="leading-relaxed text-fog-700">
              {p}
            </p>
          ))}
          {s.items && s.items.length > 0 && (
            <ul className="mt-2 divide-y divide-fog-200 overflow-hidden rounded-2xl border border-fog-200 bg-white/80">
              {s.items.map((item) => (
                <li key={item.name} className="px-4 py-3 sm:px-5">
                  <h3 className="font-semibold text-spruce-900">{item.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fog-600">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {guide.faqs.map((f) => (
            <div
              key={f.question}
              className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3"
            >
              <dt className="font-semibold text-spruce-900">{f.question}</dt>
              <dd className="mt-1 text-sm text-fog-700">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3 text-sm text-fog-600">
        More guides:{' '}
        {guide.slug !== 'things-to-do-in-ketchikan' && (
          <>
            <Link
              to="/guides/things-to-do-in-ketchikan"
              className="font-semibold text-channel-700"
            >
              Things to do
            </Link>
            {' · '}
          </>
        )}
        <Link to="/guides" className="font-semibold text-channel-700">
          All guides
        </Link>
      </nav>
    </article>
  )
}
