import { useMemo } from 'react'
import { CrowdMeter } from '../components/CrowdMeter'
import { NotificationSettings } from '../components/NotificationSettings'
import { WeatherPanel } from '../components/WeatherPanel'
import { useGateway } from '../hooks/GatewayContext'
import { addDays, formatShortDate, todayInAlaska, WEATHER_META } from '../lib/utils'

export function InsightsPage() {
  const { getDay, days, weatherLive, calibrationBias, accuracy } = useGateway()
  const today = todayInAlaska()

  const outlook = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => getDay(addDays(today, i)))
  }, [getDay, today])

  const rainRelief = useMemo(() => {
    return days
      .filter((d) => d.ships.length > 0 && d.rainRelief > 1500)
      .sort((a, b) => b.rainRelief - a.rainRelief)
      .slice(0, 6)
  }, [days])

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-spruce-900">
          Weather × crowds
        </h1>
        <p className="mt-2 max-w-2xl text-fog-600">
          Ship capacity is only half the story. Rain keeps guests aboard and cancels outdoor
          excursions — so downtown foot traffic often runs below the schedule. Live Ketchikan
          weather{weatherLive ? '' : ' (seasonal model)'} plus ship/berth weights and a
          calibration bias of ×{calibrationBias.toFixed(2)} drive the prediction.
        </p>
      </div>

      {accuracy.samples > 0 && (
        <p className="rounded-xl border border-spruce-200 bg-spruce-50 px-4 py-3 text-sm text-spruce-800">
          Model accuracy from {accuracy.samples} logged days with actuals: mean error{' '}
          {accuracy.meanAbsError.toLocaleString()} passengers ({accuracy.meanAbsPercentError}
          %).
        </p>
      )}

      <NotificationSettings />

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">7-day outlook</h2>
        <p className="mt-1 text-sm text-fog-500">
          Scheduled capacity vs weather-adjusted passengers ashore, with downtown verdict.
        </p>
        <ul className="mt-4 divide-y divide-fog-200 overflow-hidden rounded-2xl border border-fog-200 bg-white/80">
          {outlook.map((day) => {
            const wx = day.weather!
            const meta = WEATHER_META[wx.condition]
            return (
              <li
                key={day.date}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 sm:w-44">
                  <p className="font-semibold text-spruce-900">{formatShortDate(day.date)}</p>
                  <p className="text-xs text-fog-500">
                    {day.ships.length} ship{day.ships.length === 1 ? '' : 's'}
                    {day.peakHour != null ? ` · peak ~${day.peakHour}:00` : ''}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-spruce-700">
                    {day.ships.length ? day.verdictLabel : 'Quiet'}
                  </p>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <WeatherPanel weather={wx} compact />
                  <span className="text-xs text-fog-500">{meta.crowdEffect}</span>
                  {day.rainRelief >= 1200 && (
                    <span className="rounded-full bg-channel-50 px-2 py-0.5 text-[0.65rem] font-semibold text-channel-700">
                      −{day.rainRelief.toLocaleString()} vs clear
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <p className="text-[0.65rem] font-medium tracking-wide text-fog-400 uppercase">
                      Scheduled
                    </p>
                    <p className="font-display text-lg font-semibold tabular-nums text-fog-700">
                      {day.scheduledPassengers.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-fog-300" aria-hidden>
                    →
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-medium tracking-wide text-fog-400 uppercase">
                      Predicted
                    </p>
                    <p className="font-display text-lg font-semibold tabular-nums text-channel-700">
                      {day.predictedDowntown.toLocaleString()}
                    </p>
                  </div>
                  <CrowdMeter
                    level={day.weatherAdjustedCrowd}
                    passengers={day.predictedDowntown}
                    compact
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <details className="group rounded-2xl border border-fog-200 bg-white/70 open:bg-white/90">
        <summary className="cursor-pointer list-none px-4 py-4 font-display text-xl font-semibold text-spruce-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            How the prediction works
            <span className="text-sm font-medium text-fog-500 group-open:hidden">Show</span>
            <span className="hidden text-sm font-medium text-fog-500 group-open:inline">
              Hide
            </span>
          </span>
        </summary>
        <ol className="space-y-3 border-t border-fog-100 px-4 py-4 text-sm leading-relaxed text-fog-700">
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">1. Schedule + weights</strong> — sum estimated
            (or actual) passengers, then weight mega-ships higher and expedition / anchorage
            calls lower.
          </li>
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">2. Weather ashore factor</strong> — sunny ~95%
            ashore; light rain ~72%; heavy rain ~42%; storms ~30%, with hourly precip when
            available.
          </li>
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">3. Hourly curve</strong> — passengers ramp up
            after arrival and reboard before departure to find the peak downtown window.
          </li>
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">4. Calibration</strong> — predicted vs actual
            logs (Manage → actuals) tune a bias (currently ×{calibrationBias.toFixed(2)}).
          </li>
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">5. Crowd band</strong> — Low ≤3k, Moderate ≤6k,
            Busy ≤10k, Extreme &gt;10k → Quiet / Okay / Avoid 10–2.
          </li>
        </ol>
      </details>

      {rainRelief.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-spruce-900">
            Biggest weather relief days
          </h2>
          <p className="mt-1 text-sm text-fog-500">
            High-capacity days where weather is expected to keep the most passengers aboard.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {rainRelief.map((d) => (
              <li
                key={d.date}
                className="rounded-2xl border border-channel-200 bg-gradient-to-br from-white to-channel-50/60 px-4 py-4"
              >
                <p className="font-semibold text-spruce-900">{formatShortDate(d.date)}</p>
                <p className="mt-1 text-sm text-fog-600">
                  {d.scheduledPassengers.toLocaleString()} scheduled →{' '}
                  {d.predictedDowntown.toLocaleString()} predicted · {d.verdictLabel}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-channel-700 tabular-nums">
                  −{d.rainRelief.toLocaleString()}
                </p>
                <p className="text-xs text-fog-500">fewer ashore vs clear weather</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
