import { Link, Navigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { WeatherIcon } from '../../components/WeatherIcon'
import { useGateway } from '../../hooks/GatewayContext'
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonld'
import { buildMeta } from '../../lib/seo/meta'
import { isYear, monthIndex, monthLabel, monthSlug } from '../../lib/seo/slugs'
import { CROWD_META, daysInMonth, firstWeekday, WEATHER_META } from '../../lib/utils'
import type { CrowdLevel } from '../../types'

function adjacentMonth(year: number, monthIndex0: number, delta: number) {
  const d = new Date(year, monthIndex0 + delta, 1)
  return {
    year: d.getFullYear(),
    month: monthSlug(d.getMonth()),
  }
}

const CELL: Record<CrowdLevel, string> = {
  low: 'border-spruce-200 bg-spruce-100 text-spruce-800 hover:border-spruce-400',
  moderate: 'border-channel-200 bg-channel-100 text-channel-700 hover:border-channel-400',
  busy: 'border-busy-600/30 bg-busy-100 text-busy-600 hover:border-busy-500',
  extreme: 'border-alert-500/40 bg-alert-100 text-alert-600 hover:border-alert-500',
}

const DOT: Record<CrowdLevel, string> = {
  low: 'bg-spruce-600',
  moderate: 'bg-channel-600',
  busy: 'bg-busy-500',
  extreme: 'bg-alert-500',
}

export function ScheduleMonthPage() {
  const { year: yearParam = '', month: monthParam = '' } = useParams()
  const { getDay } = useGateway()

  if (!isYear(yearParam)) return <Navigate to="/404" replace />
  const mi = monthIndex(monthParam)
  if (mi == null) return <Navigate to="/404" replace />

  const year = Number(yearParam)
  const meta = buildMeta({ type: 'month', year, monthSlug: monthParam.toLowerCase() })
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: String(year), path: `/schedule/${year}` },
    {
      name: monthLabel(monthParam),
      path: `/schedule/${year}/${monthParam.toLowerCase()}`,
    },
  ]

  const dim = daysInMonth(year, mi)
  const start = firstWeekday(year, mi)
  const cells: (string | null)[] = []
  for (let i = 0; i < start; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) {
    cells.push(
      `${year}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 overflow-x-clip px-3 py-6 sm:space-y-8 sm:px-4 sm:py-10">
      <Seo
        meta={meta}
        jsonLd={[organizationJsonLd(), websiteJsonLd(), breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold text-spruce-900 sm:text-3xl">
            {meta.h1}
          </h1>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const prev = adjacentMonth(year, mi, -1)
              const next = adjacentMonth(year, mi, 1)
              return (
                <>
                  <Link
                    to={`/schedule/${prev.year}/${prev.month}`}
                    className="rounded-full border border-fog-300 bg-white px-3 py-1.5 text-sm font-semibold text-fog-700 no-underline hover:border-channel-400"
                  >
                    ← {monthLabel(prev.month)}
                  </Link>
                  <Link
                    to={`/schedule/${next.year}/${next.month}`}
                    className="rounded-full border border-fog-300 bg-white px-3 py-1.5 text-sm font-semibold text-fog-700 no-underline hover:border-channel-400"
                  >
                    {monthLabel(next.month)} →
                  </Link>
                </>
              )
            })()}
          </div>
        </div>
        <p className="max-w-2xl text-sm text-fog-600 sm:text-base">
          Tap a date for ships, berths, and the downtown forecast. Cell color is{' '}
          <strong className="font-semibold text-spruce-800">scheduled cruise capacity</strong>
          ; the icon is the weather outlook (live forecast when available, seasonal otherwise).
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[0.7rem] font-medium text-fog-600 sm:text-xs">
          <li className="w-full text-[0.65rem] font-semibold tracking-wide text-fog-400 uppercase sm:w-auto sm:mr-1">
            Capacity
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-fog-200 ring-1 ring-fog-300" />
            Quiet
          </li>
          {(
            [
              ['low', 'Low ≤3k'],
              ['moderate', 'Moderate ≤6k'],
              ['busy', 'Busy ≤10k'],
              ['extreme', 'Extreme >10k'],
            ] as const
          ).map(([level, label]) => (
            <li key={level} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-sm ${DOT[level]}`} />
              {label}
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.7rem] font-medium text-fog-600 sm:text-xs">
          <li className="w-full text-[0.65rem] font-semibold tracking-wide text-fog-400 uppercase sm:w-auto sm:mr-1">
            Weather
          </li>
          {(
            [
              'sunny',
              'partly-cloudy',
              'cloudy',
              'light-rain',
              'rain',
              'storm',
            ] as const
          ).map((condition) => (
            <li key={condition} className="flex items-center gap-1">
              <WeatherIcon condition={condition} className="h-4 w-4" />
              <span className="hidden sm:inline">{WEATHER_META[condition].label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[0.6rem] font-semibold tracking-wide text-fog-400 uppercase sm:gap-1 sm:text-[0.65rem]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="py-1">
            <span className="sm:hidden">{d}</span>
            <span className="hidden sm:inline">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((iso, i) => {
          if (!iso) return <div key={`e-${i}`} />
          const day = getDay(iso)
          const n = day.ships.filter((s) => !s.cancelled).length
          const dom = Number(iso.slice(8, 10))
          // Schedule capacity band — stable vs weather-adjusted forecasts
          const level = day.crowdLevel
          const wx = day.weather
          const wxLabel = wx ? WEATHER_META[wx.condition].label : null
          const tone =
            n === 0
              ? 'border-fog-200 bg-white/70 text-fog-400 hover:border-fog-300'
              : CELL[level]
          return (
            <Link
              key={iso}
              to={`/schedule/${iso}`}
              className={`relative flex min-h-14 flex-col rounded-lg border p-1 no-underline transition sm:min-h-[5.5rem] sm:rounded-xl sm:p-2 ${tone}`}
              aria-label={
                n === 0
                  ? `${iso}: no ships${wxLabel ? `, ${wxLabel}` : ''}`
                  : `${iso}: ${n} ships, ${day.scheduledPassengers.toLocaleString()} scheduled passengers, ${CROWD_META[level].label}${wxLabel ? `, ${wxLabel}` : ''}`
              }
            >
              <span className="flex items-start justify-between gap-0.5">
                <span className="text-[0.7rem] font-semibold sm:text-xs">{dom}</span>
                {wx && (
                  <WeatherIcon
                    condition={wx.condition}
                    className="h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5"
                    title={wxLabel ?? undefined}
                  />
                )}
              </span>
              <span className="mt-auto text-[0.55rem] leading-tight opacity-90 sm:text-[0.65rem]">
                {n === 0 ? '—' : `${n}`}
                <span className="hidden sm:inline">
                  {n === 0 ? ' Quiet' : ` ship${n === 1 ? '' : 's'}`}
                </span>
              </span>
              {n > 0 && (
                <span className="mt-0.5 hidden text-[0.65rem] font-semibold tabular-nums sm:block">
                  {day.scheduledPassengers.toLocaleString()}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <ul className="divide-y divide-fog-200 overflow-hidden rounded-2xl border border-fog-200 bg-white/80">
        {Array.from({ length: dim }, (_, i) => {
          const iso = `${year}-${String(mi + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
          const day = getDay(iso)
          const n = day.ships.filter((s) => !s.cancelled).length
          const level = day.crowdLevel
          const wx = day.weather
          return (
            <li key={iso}>
              <Link
                to={`/schedule/${iso}`}
                className="flex min-h-12 flex-wrap items-center justify-between gap-2 px-3 py-3 no-underline hover:bg-fog-50 sm:px-4"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-spruce-900 sm:text-base">
                  {n > 0 ? (
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-sm ${DOT[level]}`}
                      aria-hidden
                    />
                  ) : (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm bg-fog-200 ring-1 ring-fog-300"
                      aria-hidden
                    />
                  )}
                  {wx && (
                    <WeatherIcon
                      condition={wx.condition}
                      className="h-5 w-5 shrink-0"
                      title={WEATHER_META[wx.condition].label}
                    />
                  )}
                  {iso.slice(8)} · {n === 0 ? 'No ships' : `${n} ships`}
                </span>
                <span className="text-xs tabular-nums text-fog-600 sm:text-sm">
                  {n === 0
                    ? wx
                      ? `Quiet · ${WEATHER_META[wx.condition].label}`
                      : 'Quiet'
                    : `${day.scheduledPassengers.toLocaleString()} pax · ${CROWD_META[level].label}${wx ? ` · ${WEATHER_META[wx.condition].label}` : ''}`}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
