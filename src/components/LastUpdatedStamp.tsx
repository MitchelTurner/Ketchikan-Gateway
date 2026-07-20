type Props = {
  at: Date | null
  className?: string
}

export function LastUpdatedStamp({ at, className = '' }: Props) {
  if (!at) {
    return (
      <p className={`text-xs text-fog-500 ${className}`}>
        Schedule loading…
      </p>
    )
  }
  const label = at.toLocaleString('en-US', {
    timeZone: 'America/Anchorage',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
  return (
    <p className={`text-xs text-fog-500 ${className}`}>
      Last updated <time dateTime={at.toISOString()}>{label}</time>
    </p>
  )
}
