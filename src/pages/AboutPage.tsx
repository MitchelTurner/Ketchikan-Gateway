import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo/jsonld'
import { buildMeta } from '../lib/seo/meta'
import { ORG_NAME, SITE_NAME } from '../lib/seo/site'

export function AboutPage() {
  const meta = buildMeta({ type: 'about' })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
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
        {SITE_NAME} is a public tool from {ORG_NAME} that reports cruise ship passenger
        traffic in downtown Ketchikan, Alaska. It is built for two audiences at once:
        visitors planning shore time, and locals or businesses planning around crowds.
      </p>
      <p className="text-fog-700 leading-relaxed">
        The site is <strong className="font-semibold">unofficial</strong>. Schedules come
        from published Port of Ketchikan materials and related feeds; they change. Passenger
        numbers are labeled as estimates unless an actual count has been logged.
      </p>
      <p className="text-fog-700 leading-relaxed">
        Publisher: {ORG_NAME}. Product name used consistently across the site and app
        manifest: {SITE_NAME} (ktnport.com).
      </p>
      <ul className="list-disc space-y-1 pl-5 text-fog-700">
        <li>
          <Link to="/data-sources" className="text-channel-700">
            Data sources & methodology
          </Link>
        </li>
        <li>
          <Link to="/stats" className="text-channel-700">
            Season statistics & CSV
          </Link>
        </li>
        <li>
          <Link to="/api" className="text-channel-700">
            Data access
          </Link>
        </li>
      </ul>
    </div>
  )
}
