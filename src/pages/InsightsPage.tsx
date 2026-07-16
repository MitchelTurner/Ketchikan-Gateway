import { useMemo } from 'react'
import { CrowdMeter } from '../components/CrowdMeter'
import { WeatherPanel } from '../components/WeatherPanel'
import { useGateway } from '../hooks/GatewayContext'
import { addDays, formatShortDate, todayInAlaska, WEATHER_META } from '../lib/utils'

export function InsightsPage() {
  const { getDay, days, weatherLive } = useGateway()
  const today = todayInAlaska()

  const outlook = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => getDay(addDays(today, i)))
  }, [getDay, today])

  const rainRelief = useMemo(() => {
    return days
      .filter((d) => d.ships.length > 0 && d.weather && d.scheduledPassengers > 8000)
      .map((d) => ({
        ...d,
        saved: d.scheduledPassengers - d.predictedDowntown,
      }))
      .filter((d) => d.saved > 1500)
      .sort((a, b) => b.saved - a.saved)
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
          excursions — so downtown foot traffic often runs below the schedule. We apply an
          ashore factor from live Ketchikan weather
          {weatherLive ? '' : ' (seasonal model today)'} to predict how busy town will feel.
        </p>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">7-day outlook</h2>
        <p className="mt-1 text-sm text-fog-500">
          Scheduled capacity vs weather-adjusted passengers ashore.
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
                <div className="min-w-0 sm:w-40">
                  <p className="font-semibold text-spruce-900">{formatShortDate(day.date)}</p>
                  <p className="text-xs text-fog-500">
                    {day.ships.length} ship{day.ships.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <WeatherPanel weather={wx} compact />
                  <span className="text-xs text-fog-500">{meta.crowdEffect}</span>
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

      <section>
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          How the prediction works
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-fog-700">
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">1. Schedule capacity</strong> — sum each ship’s
            estimated (or confirmed actual) passengers for the day.
          </li>
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">2. Weather ashore factor</strong> — sunny ~95%
            ashore; light rain ~72%; heavy rain ~42%; storms ~30%, with extra dampening for high
            precip totals.
          </li>
          <li className="rounded-xl border border-fog-200 bg-white/70 px-4 py-3">
            <strong className="text-spruce-900">3. Crowd band</strong> — predicted downtown
            passengers map to Low (≤3k), Moderate (≤6k), Busy (≤10k), or Extreme (&gt;10k).
          </li>
        </ol>
      </section>

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
                  {d.predictedDowntown.toLocaleString()} predicted
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-channel-700 tabular-nums">
                  −{d.saved.toLocaleString()}
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
