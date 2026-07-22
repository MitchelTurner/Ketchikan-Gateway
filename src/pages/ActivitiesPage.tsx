import { useMemo, useState } from 'react'
import { QuietHoursMap } from '../components/QuietHoursMap'
import { activitiesForCrowd, ACTIVITIES } from '../data/activities'
import { useGateway } from '../hooks/GatewayContext'
import { getFavorites, toggleFavorite } from '../lib/favorites'
import { goAdviceForActivity } from '../lib/quietHours'
import { todayInAlaska } from '../lib/utils'
import type { Activity } from '../types'

const CATEGORY_LABEL: Record<Activity['category'], string> = {
  culture: 'Culture',
  nature: 'Nature',
  adventure: 'Adventure',
  food: 'Food',
}

const ADVICE_STYLE = {
  'go-now': 'bg-spruce-100 text-spruce-800',
  wait: 'bg-busy-100 text-busy-600',
  'good-anytime': 'bg-channel-100 text-channel-700',
} as const

export function ActivitiesPage() {
  const { getDay } = useGateway()
  const today = getDay(todayInAlaska())
  const [filter, setFilter] = useState<'recommended' | 'all' | 'favorites'>('recommended')
  const [favorites, setFavorites] = useState(() => getFavorites())

  const list = useMemo(() => {
    if (filter === 'favorites') {
      return ACTIVITIES.filter((a) => favorites.includes(a.id))
    }
    if (filter === 'all') return ACTIVITIES
    return activitiesForCrowd(today.weatherAdjustedCrowd)
  }, [filter, today.weatherAdjustedCrowd, favorites])

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          Plan around the ships
        </h1>
        <p className="mt-2 max-w-2xl text-fog-600">
          Today’s weather-adjusted crowd is{' '}
          <strong className="font-semibold text-spruce-800">
            {today.weatherAdjustedCrowd}
          </strong>
          . Favorite spots get a live go-now / wait tip from the hourly curve.
        </p>
      </div>

      <QuietHoursMap level={today.weatherAdjustedCrowd} />

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['recommended', 'For today’s crowd'],
            ['favorites', 'Favorites'],
            ['all', 'All activities'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition',
              filter === id
                ? 'bg-spruce-900 text-fog-50'
                : 'border border-fog-300 bg-white/70 text-fog-700 hover:bg-white',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.length === 0 && filter === 'favorites' && (
          <p className="col-span-full text-sm text-fog-500">
            No favorites yet — tap the star on any activity.
          </p>
        )}
        {list.map((activity) => {
          const advice = goAdviceForActivity(activity, today)
          const fav = favorites.includes(activity.id)
          return (
            <article
              key={activity.id}
              className="rounded-2xl border border-fog-200 bg-white/75 p-5 transition hover:border-channel-300"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-spruce-900">
                  {activity.name}
                </h2>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-spruce-50 px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wide text-spruce-700 uppercase">
                    {CATEGORY_LABEL[activity.category]}
                  </span>
                  <button
                    type="button"
                    aria-label={fav ? 'Remove favorite' : 'Add favorite'}
                    onClick={() => setFavorites(toggleFavorite(activity.id))}
                    className={[
                      'grid h-8 w-8 place-items-center rounded-full border text-sm',
                      fav
                        ? 'border-dawn-400 bg-dawn-100 text-spruce-900'
                        : 'border-fog-300 bg-white text-fog-400',
                    ].join(' ')}
                  >
                    ★
                  </button>
                </div>
              </div>
              <p
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ADVICE_STYLE[advice.advice]}`}
              >
                {advice.label}
              </p>
              <p className="mt-1 text-xs text-fog-500">{advice.detail}</p>
              <p className="mt-2 text-sm leading-relaxed text-fog-600">
                {activity.description}
              </p>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium text-fog-400">When</dt>
                  <dd className="text-fog-700">{activity.bestTime}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium text-fog-400">Quiet</dt>
                  <dd className="text-fog-700">{activity.quietHours}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 font-medium text-fog-400">Tip</dt>
                  <dd className="text-channel-700">{activity.crowdTip}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </div>
    </div>
  )
}
