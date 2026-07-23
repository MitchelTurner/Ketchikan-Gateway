import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { GetYourGuideOffers } from '../../components/GetYourGuideOffers'
import { GuideDayPlan } from '../../components/guides/GuideDayPlan'
import { GuideLiveModule } from '../../components/guides/GuideLiveModule'
import { GuideToc } from '../../components/guides/GuideToc'
import { Seo } from '../../components/Seo'
import { getGuide, type GuideImage, type GuideTag } from '../../data/guides'
import { useGateway } from '../../hooks/GatewayContext'
import {
  filterGuideSections,
  sectionDomId,
  shoreWindowHours,
} from '../../lib/guideHelpers'
import { gygSearchUrl } from '../../lib/getyourguide'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { todayInAlaska } from '../../lib/utils'

const TAG_LABEL: Record<GuideTag, string> = {
  'port-day': 'Port day',
  planning: 'Planning',
  berths: 'Berths',
  tours: 'Tours',
  crowds: 'Crowds',
}

function GuideFigure({ image, priority = false }: { image: GuideImage; priority?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-fog-200 bg-fog-50 print:break-inside-avoid">
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

function RelatedGuideCard({ slug }: { slug: string }) {
  const related = getGuide(slug)
  if (!related) return null
  return (
    <Link
      to={`/guides/${related.slug}`}
      className="block rounded-xl border border-fog-200 bg-white/80 px-4 py-3 no-underline transition hover:border-channel-400 print:break-inside-avoid"
    >
      <p className="text-[0.65rem] font-semibold tracking-wider text-fog-400 uppercase">
        Related guide
      </p>
      <p className="mt-1 font-semibold text-spruce-900">{related.title}</p>
      <p className="mt-1 text-sm text-fog-600">{related.description}</p>
    </Link>
  )
}

export function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  const { getDay } = useGateway()
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const todayIso = todayInAlaska()
  const today = getDay(todayIso)
  const shoreHrs = shoreWindowHours(today)
  const suggestedMax =
    shoreHrs != null ? Math.min(4, Math.max(2, Math.floor(shoreHrs))) : null

  const sections = useMemo(
    () => (guide ? filterGuideSections(guide, query) : []),
    [guide, query],
  )

  if (!guide) return <Navigate to="/404" replace />

  const isThingsToDo = guide.slug === 'things-to-do-in-ketchikan'
  const showSearch = isThingsToDo || guide.sections.some((s) => (s.items?.length ?? 0) > 0)

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

  return (
    <article className="guide-article mx-auto max-w-3xl space-y-8 px-4 py-10">
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
        <ul className="flex flex-wrap gap-1.5 print:hidden">
          {guide.tags.map((t) => (
            <li
              key={t}
              className="rounded bg-fog-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-fog-700"
            >
              {TAG_LABEL[t]}
            </li>
          ))}
        </ul>
        <h1 className="font-display text-3xl font-semibold text-spruce-900 sm:text-4xl">
          {meta.h1}
        </h1>
        <p className="text-fog-600">{guide.description}</p>
        <p className="text-xs text-fog-400">
          Updated {guide.updated} · {guide.readMinutes} min read
        </p>
        <GuideDayPlan guide={guide} />
        <GuideFigure image={guide.hero} priority />
      </header>

      <GuideLiveModule showActivities={isThingsToDo} />

      <GuideToc
        sections={query.trim() ? sections : guide.sections}
        includeTours={isThingsToDo}
      />

      {showSearch && (
        <div className="print:hidden">
          <label htmlFor="guide-search" className="sr-only">
            Search this guide
          </label>
          <input
            id="guide-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search attractions, trails, tours…"
            className="w-full rounded-xl border border-fog-200 bg-white/90 px-3 py-2.5 text-sm text-spruce-900 outline-none ring-channel-400 placeholder:text-fog-400 focus:ring-2"
          />
          {query.trim() && (
            <p className="mt-1.5 text-xs text-fog-500">
              Showing {sections.length} section{sections.length === 1 ? '' : 's'} matching “
              {query.trim()}”
            </p>
          )}
        </div>
      )}

      {sections.map((s, index) => {
        const sid = sectionDomId(s)
        const insertTours = isThingsToDo && !query.trim() && index === 0
        return (
          <div key={s.heading} className="space-y-8">
            <section id={sid} className="space-y-3 scroll-mt-28">
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
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-spruce-900">{item.name}</h3>
                        {item.bookQuery && (
                          <a
                            href={gygSearchUrl(item.bookQuery, `ktn-attraction-${sid}`)}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="shrink-0 text-xs font-semibold text-channel-700 no-underline hover:underline print:hidden"
                          >
                            Book related tours →
                          </a>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-fog-600">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            {s.relatedSlug && <RelatedGuideCard slug={s.relatedSlug} />}
            {insertTours && (
              <GetYourGuideOffers
                campaign="ktn-things-to-do"
                initialVisible={6}
                maxDurationHours={suggestedMax}
              />
            )}
          </div>
        )
      })}

      {sections.length === 0 && (
        <p className="text-sm text-fog-600">
          No sections match that search.{' '}
          <button
            type="button"
            className="font-semibold text-channel-700"
            onClick={() => setQuery('')}
          >
            Clear search
          </button>
        </p>
      )}

      <section id="faq" className="scroll-mt-28">
        <h2 className="font-display text-xl font-semibold text-spruce-900">FAQ</h2>
        <div className="mt-4 space-y-2">
          {guide.faqs.map((f, i) => {
            const open = openFaq === i
            return (
              <div
                key={f.question}
                className="rounded-xl border border-fog-200 bg-white/70"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-spruce-900 print:cursor-default"
                >
                  <span>{f.question}</span>
                  <span className="text-fog-400 print:hidden" aria-hidden>
                    {open ? '−' : '+'}
                  </span>
                </button>
                <p
                  className={[
                    'border-t border-fog-100 px-4 py-3 text-sm text-fog-700',
                    open ? 'block' : 'hidden print:block',
                  ].join(' ')}
                >
                  {f.answer}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {guide.relatedSlugs.length > 0 && (
        <section className="space-y-3 print:hidden">
          <h2 className="font-display text-lg font-semibold text-spruce-900">
            Keep planning
          </h2>
          <ul className="grid gap-3">
            {guide.relatedSlugs.map((rs) => (
              <li key={rs}>
                <RelatedGuideCard slug={rs} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3 text-sm text-fog-600 print:hidden">
        <Link to="/guides" className="font-semibold text-channel-700">
          All guides
        </Link>
        {' · '}
        <Link to="/activities" className="font-semibold text-channel-700">
          Activities
        </Link>
        {' · '}
        <Link to={`/schedule/${todayIso}`} className="font-semibold text-channel-700">
          Today’s schedule
        </Link>
      </nav>
    </article>
  )
}
