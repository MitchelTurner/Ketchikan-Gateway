import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CancelledShipsBanner } from '../components/CancelledShipsBanner'
import { CapacitySplit } from '../components/CapacitySplit'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { CrowdMeter } from '../components/CrowdMeter'
import { DowntownTimeline } from '../components/DowntownTimeline'
import { DowntownVerdictBanner } from '../components/DowntownVerdict'
import { HourlyCrowdChart } from '../components/HourlyCrowdChart'
import { LastVerifiedBanner } from '../components/LastVerified'
import { MarinePanel } from '../components/MarinePanel'
import { RainReliefBanner } from '../components/RainReliefBanner'
import { ShareDayButton } from '../components/ShareDayButton'
import { ShipList } from '../components/ShipList'
import { WeatherConflictBanner } from '../components/WeatherConflictBanner'
import { WeatherPanel } from '../components/WeatherPanel'
import { WhyThisNumber } from '../components/WhyThisNumber'
import { useGateway } from '../hooks/GatewayContext'
import { addDays, formatLongDate, todayInAlaska } from '../lib/utils'

function resolveDateParam(raw: string): string | null {
  if (raw === 'tomorrow') return addDays(todayInAlaska(), 1)
  if (raw === 'today') return todayInAlaska()
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  return null
}

export function DayPage() {
  const { date: raw = '' } = useParams()
  const aliasTarget =
    raw === 'tomorrow' || raw === 'today' ? resolveDateParam(raw) : null
  const date = useMemo(() => resolveDateParam(raw) ?? '', [raw])
  const { getDay, loading } = useGateway()
  const day = getDay(date || todayInAlaska())

  useEffect(() => {
    if (!date || aliasTarget) return
    const title = `KTN Port ${date}: ${day.verdictLabel} · ${day.predictedDowntown.toLocaleString()} ashore`
    document.title = `${title} | KTN Port`
    const desc = day.why || 'Cruise passenger forecast for Ketchikan, Alaska.'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', desc)

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    setOg('og:title', title)
    setOg('og:description', desc)
    setOg('og:url', `https://ktnport.com/day/${date}`)
  }, [aliasTarget, date, day])

  if (aliasTarget) {
    return <Navigate to={`/day/${aliasTarget}`} replace />
  }

  if (!date) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-fog-600">Invalid date.</p>
        <Link to="/" className="text-channel-700">
          Back to today
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-fog-400 uppercase">
            Day card
          </p>
          <h1 className="font-display text-3xl font-semibold text-spruce-900">
            {formatLongDate(date)}
          </h1>
          <p className="mt-2 max-w-xl text-fog-600">
            {loading
              ? 'Loading…'
              : day.ships.filter((s) => !s.cancelled).length === 0
                ? 'No active ships this day.'
                : `${day.predictedDowntown.toLocaleString()} predicted ashore · ${day.verdictLabel}`}
          </p>
        </div>
        <ShareDayButton day={day} />
      </div>

      <LastVerifiedBanner />

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-spruce-900 via-channel-700 to-spruce-800 p-6 text-fog-50 shadow-lg">
        <p className="font-display text-2xl font-semibold text-dawn-400">
          Ketchikan Port Traffic
        </p>
        <p className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {day.verdictLabel}
        </p>
        <p className="mt-2 text-lg text-channel-100">
          {day.predictedDowntown.toLocaleString()} predicted ashore
          <span className="text-channel-200">
            {' '}
            · {day.scheduledPassengers.toLocaleString()} scheduled
          </span>
        </p>
        <p className="mt-4 text-sm text-fog-200">{day.why}</p>
      </div>

      <CancelledShipsBanner ships={day.ships} date={date} />
      <WeatherConflictBanner day={day} />
      <DowntownTimeline day={day} />

      {day.ships.some((s) => !s.cancelled) && <DowntownVerdictBanner day={day} />}
      <RainReliefBanner day={day} />
      <ConfidenceBadge day={day} />

      <div className="grid gap-4 md:grid-cols-2">
        <CrowdMeter
          level={day.weatherAdjustedCrowd}
          passengers={day.predictedDowntown}
          label="Weather-adjusted crowd"
        />
        {day.weather && <WeatherPanel weather={day.weather} />}
      </div>

      <CapacitySplit day={day} />
      <WhyThisNumber why={day.why || 'No ships scheduled.'} />
      {day.hourlyCrowd.length > 0 && (
        <HourlyCrowdChart points={day.hourlyCrowd} peakHour={day.peakHour} />
      )}
      <MarinePanel date={date} />
      <ShipList ships={day.ships} />
      <Link to="/" className="inline-block text-sm font-semibold text-channel-700">
        ← Back to today
      </Link>
    </div>
  )
}
