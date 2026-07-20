import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { buildMeta } from '../lib/seo/meta'

export function NotFoundPage() {
  const meta = buildMeta({ type: 'notFound' })
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <Seo meta={meta} />
      <p className="text-sm font-semibold tracking-wider text-fog-400 uppercase">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-spruce-900">
        {meta.h1}
      </h1>
      <p className="mt-3 text-fog-600">
        That URL is not a valid KTN Port page. Invalid dates (like February 31) also land
        here.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50 no-underline"
        >
          Today
        </Link>
        <Link
          to="/schedule"
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
        >
          Schedule
        </Link>
      </div>
    </div>
  )
}
