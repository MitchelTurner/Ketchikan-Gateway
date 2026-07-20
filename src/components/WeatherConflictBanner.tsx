import { weatherCrowdConflict } from '../lib/downtownNow'
import type { DayForecast } from '../types'

export function WeatherConflictBanner({ day }: { day: DayForecast }) {
  const msg = weatherCrowdConflict(day)
  if (!msg) return null
  return (
    <div className="rounded-2xl border border-dawn-400/40 bg-dawn-100/70 px-4 py-3 text-sm text-spruce-900">
      <p className="text-xs font-semibold tracking-wider text-busy-600 uppercase">
        Weather × schedule signal
      </p>
      <p className="mt-1">{msg}</p>
    </div>
  )
}
