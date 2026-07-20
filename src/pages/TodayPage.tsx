import { Link } from 'react-router-dom'
import { CancelledShipsBanner } from '../components/CancelledShipsBanner'
import { CapacitySplit } from '../components/CapacitySplit'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { CrowdMeter } from '../components/CrowdMeter'
import { DowntownTimeline } from '../components/DowntownTimeline'
import { DowntownVerdictBanner } from '../components/DowntownVerdict'
import { HourlyCrowdChart } from '../components/HourlyCrowdChart'
import { LastUpdated } from '../components/LastUpdated'
import { LastVerifiedBanner } from '../components/LastVerified'
import { MarinePanel } from '../components/MarinePanel'
import { QuietHoursMap } from '../components/QuietHoursMap'
import { RainReliefBanner } from '../components/RainReliefBanner'
import { RightNowPanel } from '../components/RightNow'
import { Seo } from '../components/Seo'
import { ShareDayButton } from '../components/ShareDayButton'
import { ShipList } from '../components/ShipList'
import { StickyGoDowntown } from '../components/StickyGoDowntown'
import { TomorrowCompare } from '../components/TomorrowCompare'
import { WeatherConflictBanner } from '../components/WeatherConflictBanner'
import { WeatherPanel } from '../components/WeatherPanel'
import { WhyThisNumber } from '../components/WhyThisNumber'
import { useGateway } from '../hooks/GatewayContext'
import { shouldGoDowntown } from '../lib/downtownNow'
import {
  organizationJsonLd,
  websiteJsonLd,
} from '../lib/seo/jsonld'
import { buildMeta } from '../lib/seo/meta'
import { monthSlug } from '../lib/seo/slugs'
import { addDays, formatLongDate, todayInAlaska } from '../lib/utils'

export function TodayPage() {
  const {
    getDay,
    loading,
    seasonStats,
    lastUpdated,
    source,
    weatherLive,
    refetch,
  } = useGateway()
  const today = todayInAlaska()
  const day = getDay(today)
  const tomorrow = getDay(addDays(today, 1))
  const weather = day.weather!
  const activeShips = day.ships.filter((s) => !s.cancelled)
  const answer = shouldGoDowntown(day)
  const meta = buildMeta({ type: 'home' })
  const y = Number(today.slice(0, 4))
  const m = monthSlug(Number(today.slice(5, 7)) - 1)

  return (
    <div className="overflow-x-clip">
      <Seo meta={meta} jsonLd={[organizationJsonLd(), websiteJsonLd(true)]} />
      <StickyGoDowntown day={day} />

      <section className="relative overflow-hidden border-b border-spruce-900/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(232,197,106,0.2),transparent_45%),linear-gradient(135deg,#16352f_0%,#1f5558_48%,#2a5f53_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 top-10 hidden h-40 w-[70%] rounded-full bg-white/10 blur-3xl animate-mist sm:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#dfe9ea] to-transparent sm:h-24"
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-4 sm:pb-14 sm:pt-12">
          <p className="animate-rise font-display text-3xl font-semibold tracking-tight text-dawn-400 sm:text-5xl md:text-6xl">
            KTN Port
          </p>
          <h1 className="animate-rise-delay-1 mt-3 max-w-2xl font-display text-xl font-medium leading-snug text-fog-50 sm:mt-4 sm:text-3xl">
            {meta.h1}
          </h1>
          <p className="animate-rise-delay-2 mt-2 max-w-xl text-sm text-channel-200 sm:mt-3 sm:text-lg">
            {formatLongDate(today)}.{' '}
            {loading ? 'Loading forecast…' : answer.short}
          </p>
          <div className="animate-rise-delay-2 mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <a
              href="#right-now"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-dawn-400 px-5 py-2.5 text-sm font-semibold text-spruce-950 no-underline transition hover:bg-dawn-100"
            >
              Right now
            </a>
            <Link
              to="/schedule/tomorrow"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-fog-50 no-underline backdrop-blur transition hover:bg-white/20"
            >
              Tomorrow
            </Link>
          </div>
        </div>
      </section>

      <div id="today-detail" className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <LastUpdated
            at={lastUpdated}
            source={source}
            weatherLive={weatherLive}
            onRefresh={() => void refetch()}
            loading={loading}
          />
          <ShareDayButton day={day} compact />
        </div>
        <LastVerifiedBanner />

        <div id="right-now">
          <RightNowPanel day={day} />
        </div>

        <DowntownTimeline day={day} />
        <TomorrowCompare today={day} tomorrow={tomorrow} />

        <CancelledShipsBanner ships={day.ships} date={today} />
        <WeatherConflictBanner day={day} />
        <RainReliefBanner day={day} />

        <section>
          <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold text-spruce-900 sm:text-2xl">
                Ships in port
              </h2>
              <p className="text-sm text-fog-500">
                {activeShips.length === 0
                  ? 'Quiet waterfront today.'
                  : `${activeShips.length} active`}
                {day.cancelledCount > 0 ? ` · ${day.cancelledCount} cancelled` : ''}
              </p>
            </div>
            <CrowdMeter
              level={day.crowdLevel}
              passengers={day.scheduledPassengers}
              compact
            />
          </div>
          <ShipList ships={day.ships} />
        </section>

        <nav
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-fog-600"
          aria-label="More on KTN Port"
        >
          <Link to={`/schedule/${today}`} className="font-semibold text-channel-700">
            Full day page
          </Link>
          <Link to={`/schedule/${y}/${m}`} className="hover:text-spruce-900">
            This month
          </Link>
          <Link to="/stats" className="hover:text-spruce-900">
            Stats
          </Link>
          <Link
            to="/guides/best-time-to-visit-ketchikan"
            className="hover:text-spruce-900"
          >
            Avoid crowds
          </Link>
        </nav>

        <details className="group rounded-2xl border border-fog-200 bg-white/70 open:bg-white/90">
          <summary className="cursor-pointer list-none px-4 py-3.5 font-display text-base font-semibold text-spruce-900 marker:content-none sm:py-4 sm:text-lg [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              More detail
              <span className="text-sm font-medium text-fog-500 group-open:hidden">
                Weather & chart
              </span>
              <span className="hidden text-sm font-medium text-fog-500 group-open:inline">
                Hide
              </span>
            </span>
          </summary>
          <div className="space-y-5 border-t border-fog-100 px-4 py-4 sm:space-y-6 sm:py-5">
            {activeShips.length > 0 && <DowntownVerdictBanner day={day} />}
            <ConfidenceBadge day={day} />

            <section className="grid gap-4 md:grid-cols-2">
              <CrowdMeter
                level={day.weatherAdjustedCrowd}
                passengers={day.predictedDowntown}
                label="Weather-adjusted crowd"
              />
              <WeatherPanel weather={weather} />
            </section>

            <CapacitySplit day={day} />
            <WhyThisNumber why={day.why || 'No ships scheduled.'} />

            {activeShips.length > 0 && (
              <div className="min-h-[14rem] overflow-x-auto">
                <HourlyCrowdChart points={day.hourlyCrowd} peakHour={day.peakHour} />
              </div>
            )}

            <MarinePanel date={today} />
            <QuietHoursMap level={day.weatherAdjustedCrowd} />

            {seasonStats && (
              <section className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
                {[
                  {
                    label: 'Season passengers',
                    value: seasonStats.totalPassengers.toLocaleString(),
                  },
                  {
                    label: 'Ship visits',
                    value: seasonStats.totalVisits.toLocaleString(),
                  },
                  {
                    label: 'Extreme days',
                    value: String(seasonStats.extremeDays),
                  },
                  {
                    label: 'Rain-relief days',
                    value: String(seasonStats.rainReliefDays),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-fog-200 bg-white/60 px-3 py-3 sm:px-4 sm:py-4"
                  >
                    <p className="text-[0.65rem] font-semibold tracking-wide text-fog-400 uppercase sm:text-[0.7rem]">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-spruce-900 tabular-nums sm:text-2xl">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </details>
      </div>
    </div>
  )
}
