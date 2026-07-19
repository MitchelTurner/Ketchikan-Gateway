import { Link } from 'react-router-dom'
import { CapacitySplit } from '../components/CapacitySplit'
import { CrowdMeter } from '../components/CrowdMeter'
import { DowntownVerdictBanner } from '../components/DowntownVerdict'
import { HourlyCrowdChart } from '../components/HourlyCrowdChart'
import { LastUpdated } from '../components/LastUpdated'
import { RainReliefBanner } from '../components/RainReliefBanner'
import { ShipList } from '../components/ShipList'
import { WeatherPanel } from '../components/WeatherPanel'
import { WhyThisNumber } from '../components/WhyThisNumber'
import { useGateway } from '../hooks/GatewayContext'
import { formatLongDate, todayInAlaska } from '../lib/utils'

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
  const weather = day.weather!

  return (
    <div>
      <section className="relative overflow-hidden border-b border-spruce-900/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(232,197,106,0.2),transparent_45%),linear-gradient(135deg,#16352f_0%,#1f5558_48%,#2a5f53_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 top-10 h-40 w-[70%] rounded-full bg-white/10 blur-3xl animate-mist"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#dfe9ea] to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <p className="animate-rise font-display text-4xl font-semibold tracking-tight text-dawn-400 sm:text-5xl md:text-6xl">
            Ketchikan Gateway
          </p>
          <h1 className="animate-rise-delay-1 mt-4 max-w-2xl font-display text-2xl font-medium leading-snug text-fog-50 sm:text-3xl">
            {loading
              ? 'Loading today’s passenger forecast…'
              : day.ships.length === 0
                ? 'No cruise ships in port today.'
                : day.verdict === 'avoid'
                  ? `${day.verdictLabel} — ${day.predictedDowntown.toLocaleString()} predicted ashore`
                  : `${day.predictedDowntown.toLocaleString()} passengers predicted ashore`}
          </h1>
          <p className="animate-rise-delay-2 mt-3 max-w-xl text-base text-channel-200 sm:text-lg">
            {formatLongDate(today)}. {day.ships.length > 0 ? day.why : 'Quiet waterfront.'}
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <a
              href="#today-detail"
              className="rounded-full bg-dawn-400 px-5 py-2.5 text-sm font-semibold text-spruce-950 no-underline transition hover:bg-dawn-100"
            >
              See ships & hourly curve
            </a>
            <Link
              to="/insights"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-fog-50 no-underline backdrop-blur transition hover:bg-white/20"
            >
              Weather × crowds
            </Link>
          </div>
        </div>
      </section>

      <div id="today-detail" className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <LastUpdated
          at={lastUpdated}
          source={source}
          weatherLive={weatherLive}
          onRefresh={() => void refetch()}
          loading={loading}
        />

        {day.ships.length > 0 && <DowntownVerdictBanner day={day} />}
        <RainReliefBanner day={day} />

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

        {day.ships.length > 0 && (
          <HourlyCrowdChart points={day.hourlyCrowd} peakHour={day.peakHour} />
        )}

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-spruce-900">
                Ships in port
              </h2>
              <p className="text-sm text-fog-500">
                {day.ships.length === 0
                  ? 'Quiet waterfront today.'
                  : `${day.ships.length} vessel${day.ships.length === 1 ? '' : 's'} · weighted for size & berth`}
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

        {seasonStats && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                className="rounded-2xl border border-fog-200 bg-white/60 px-4 py-4"
              >
                <p className="text-[0.7rem] font-semibold tracking-wide text-fog-400 uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-spruce-900 tabular-nums">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
