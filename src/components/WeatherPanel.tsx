import { WEATHER_META } from '../lib/utils'
import type { DayWeather } from '../types'

function hourLabel(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}${hour >= 12 ? 'PM' : 'AM'}`
}

function nextDryWindow(weather: DayWeather): string | null {
  const hourly = weather.hourly?.filter((h) => h.hour >= 8 && h.hour <= 18) ?? []
  if (hourly.length === 0) return null
  const nowHour = Number(
    new Date().toLocaleString('en-US', {
      timeZone: 'America/Juneau',
      hour: 'numeric',
      hour12: false,
    }),
  )
  const pool = hourly.filter((h) => h.hour >= Math.min(nowHour, 18))
  const use = pool.length ? pool : hourly
  const dry = use.find((h) => h.precipMm < 0.2 && h.precipProbability < 40)
  if (dry) return `Clearest stretch around ${hourLabel(dry.hour)}`
  const driest = [...use].sort((a, b) => a.precipMm - b.precipMm)[0]
  return driest ? `Least rain near ${hourLabel(driest.hour)}` : null
}

function WeatherGlyph({ condition }: { condition: DayWeather['condition'] }) {
  const common = 'h-8 w-8'
  switch (condition) {
    case 'sunny':
      return (
        <svg viewBox="0 0 32 32" className={common} aria-hidden>
          <circle cx="16" cy="16" r="6" fill="#E8C56A" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="16"
              y1="3"
              x2="16"
              y2="7"
              stroke="#E8C56A"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${deg} 16 16)`}
            />
          ))}
        </svg>
      )
    case 'partly-cloudy':
      return (
        <svg viewBox="0 0 32 32" className={common} aria-hidden>
          <circle cx="11" cy="12" r="5" fill="#E8C56A" />
          <path
            d="M10 22h14a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2 2A4.5 4.5 0 0 0 10 22z"
            fill="#8a9aa3"
          />
        </svg>
      )
    case 'cloudy':
      return (
        <svg viewBox="0 0 32 32" className={common} aria-hidden>
          <path
            d="M8 22h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 22z"
            fill="#6b7c86"
          />
        </svg>
      )
    case 'storm':
      return (
        <svg viewBox="0 0 32 32" className={common} aria-hidden>
          <path
            d="M8 16h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 16z"
            fill="#3d4a52"
          />
          <path d="M15 17l-3 6h3l-2 5 7-8h-3l2-3z" fill="#E8C56A" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 32 32" className={common} aria-hidden>
          <path
            d="M8 16h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 16z"
            fill="#5aa3a6"
          />
          <path d="M12 20v4M16 19v5M20 20v4" stroke="#2a6b6e" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
  }
}

export function WeatherPanel({
  weather,
  compact = false,
}: {
  weather: DayWeather
  compact?: boolean
}) {
  const meta = WEATHER_META[weather.condition]
  const dryTip = nextDryWindow(weather)

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-channel-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-fog-700">
        <WeatherGlyph condition={weather.condition} />
        <span>
          {weather.tempHighF}° / {weather.tempLowF}°
        </span>
        <span className="text-fog-400">{meta.label}</span>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-channel-200/80 bg-gradient-to-br from-white/90 to-channel-50/80 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-channel-700 uppercase">
            Ketchikan weather
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-spruce-900">
            {weather.tempHighF}°F
          </p>
          <p className="text-sm text-fog-500">
            Low {weather.tempLowF}° · {meta.label}
          </p>
        </div>
        <WeatherGlyph condition={weather.condition} />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-white/70 px-2 py-2">
          <dt className="text-fog-400">Precip</dt>
          <dd className="mt-0.5 font-semibold text-fog-800 tabular-nums">
            {weather.precipitationMm.toFixed(1)} mm
          </dd>
        </div>
        <div className="rounded-xl bg-white/70 px-2 py-2">
          <dt className="text-fog-400">Chance</dt>
          <dd className="mt-0.5 font-semibold text-fog-800 tabular-nums">
            {weather.precipProbability}%
          </dd>
        </div>
        <div className="rounded-xl bg-white/70 px-2 py-2">
          <dt className="text-fog-400">Wind</dt>
          <dd className="mt-0.5 font-semibold text-fog-800 tabular-nums">
            {weather.windMph} mph
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-channel-700">{meta.crowdEffect}</p>
      {dryTip && (
        <p className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-spruce-800">
          {dryTip} — better window to head downtown.
        </p>
      )}
      <p className="mt-2 text-[0.7rem] text-fog-400">
        Ashore factor {Math.round(weather.ashoreFactor * 100)}% of scheduled capacity
        {weather.hourly?.length ? ' · hourly forecast loaded' : ''}
      </p>
    </div>
  )
}
