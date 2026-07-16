import { useMemo, useState } from 'react'
import { activitiesForCrowd, ACTIVITIES } from '../data/activities'
import { useGateway } from '../hooks/GatewayContext'
import { todayInAlaska } from '../lib/utils'
import type { Activity } from '../types'

const CATEGORY_LABEL: Record<Activity['category'], string> = {
  culture: 'Culture',
  nature: 'Nature',
  adventure: 'Adventure',
  food: 'Food',
}

export function ActivitiesPage() {
  const { getDay } = useGateway()
  const today = getDay(todayInAlaska())
  const [filter, setFilter] = useState<'recommended' | 'all'>('recommended')

  const list = useMemo(() => {
    if (filter === 'all') return ACTIVITIES
    return activitiesForCrowd(today.weatherAdjustedCrowd)
  }, [filter, today.weatherAdjustedCrowd])

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
          . These picks stay enjoyable when downtown fills up — or when rain thins the
          waterfront.
        </p>
      </div>

      <div className="flex gap-2">
        {(
          [
            ['recommended', 'For today’s crowd'],
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
        {list.map((activity) => (
          <article
            key={activity.id}
            className="rounded-2xl border border-fog-200 bg-white/75 p-5 transition hover:border-channel-300"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-spruce-900">
                {activity.name}
              </h2>
              <span className="shrink-0 rounded-full bg-spruce-50 px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wide text-spruce-700 uppercase">
                {CATEGORY_LABEL[activity.category]}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fog-600">{activity.description}</p>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium text-fog-400">When</dt>
                <dd className="text-fog-700">{activity.bestTime}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium text-fog-400">Where</dt>
                <dd className="text-fog-700">{activity.location}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 font-medium text-fog-400">Tip</dt>
                <dd className="text-channel-700">{activity.crowdTip}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}
