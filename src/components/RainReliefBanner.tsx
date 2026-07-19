import type { DayForecast } from '../types'
import { WEATHER_META } from '../lib/utils'

export function RainReliefBanner({ day }: { day: DayForecast }) {
  if (day.ships.length === 0) return null
  if (day.rainRelief < 1200) return null
  if (!day.dropsCrowdBand && day.crowdLevel !== 'busy' && day.crowdLevel !== 'extreme') {
    return null
  }

  const condition = day.weather ? WEATHER_META[day.weather.condition].label : 'Weather'

  return (
    <div className="rounded-2xl border border-channel-300 bg-gradient-to-r from-channel-50 to-white px-5 py-4">
      <p className="text-xs font-semibold tracking-wider text-channel-700 uppercase">
        Rain relief
      </p>
      <p className="mt-1 font-display text-xl font-semibold text-spruce-900">
        ~{day.rainRelief.toLocaleString()} fewer ashore than a clear day
      </p>
      <p className="mt-1 text-sm text-channel-700">
        {condition} is cutting a {day.crowdLevel} schedule
        {day.dropsCrowdBand
          ? ` down to ${day.weatherAdjustedCrowd} downtown`
          : ' — still busy, but softer than capacity suggests'}
        .
      </p>
    </div>
  )
}
