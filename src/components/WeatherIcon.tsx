import type { WeatherCondition } from '../types'

type Props = {
  condition: WeatherCondition
  className?: string
  title?: string
}

/** Compact weather glyph for calendar cells and weather panels. */
export function WeatherIcon({
  condition,
  className = 'h-5 w-5',
  title,
}: Props) {
  switch (condition) {
    case 'sunny':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
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
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
          <circle cx="11" cy="12" r="5" fill="#E8C56A" />
          <path
            d="M10 22h14a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.2 2A4.5 4.5 0 0 0 10 22z"
            fill="#8a9aa3"
          />
        </svg>
      )
    case 'cloudy':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
          <path
            d="M8 22h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 22z"
            fill="#6b7c86"
          />
        </svg>
      )
    case 'storm':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
          <path
            d="M8 16h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 16z"
            fill="#3d4a52"
          />
          <path d="M15 17l-3 6h3l-2 5 7-8h-3l2-3z" fill="#E8C56A" />
        </svg>
      )
    case 'light-rain':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
          <path
            d="M8 18h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 18z"
            fill="#7a8e98"
          />
          <path
            d="M12 21v3M16 20v3M20 21v3"
            stroke="#5aa3a6"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'heavy-rain':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
          <path
            d="M8 16h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 16z"
            fill="#3d5a62"
          />
          <path
            d="M11 19v5M15 18v6M19 19v5M13 20v4M17 20v4"
            stroke="#2a6b6e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'rain':
    default:
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          {title ? <title>{title}</title> : null}
          <path
            d="M8 16h15a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.5 2.2A4.5 4.5 0 0 0 8 16z"
            fill="#5aa3a6"
          />
          <path
            d="M12 20v4M16 19v5M20 20v4"
            stroke="#2a6b6e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}
