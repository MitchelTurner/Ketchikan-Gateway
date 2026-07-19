export function LastUpdated({
  at,
  source,
  weatherLive,
  onRefresh,
  loading,
}: {
  at: Date | null
  source: 'pocketbase' | 'local'
  weatherLive: boolean
  onRefresh: () => void
  loading?: boolean
}) {
  const time = at
    ? at.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Anchorage',
      })
    : '—'

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-fog-500">
      <span>
        Updated {time} AK · {source === 'pocketbase' ? 'live port DB' : 'bundled schedule'}
        {weatherLive ? ' · Open-Meteo' : ' · seasonal weather'}
      </span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="rounded-full border border-fog-300 bg-white/70 px-2.5 py-0.5 font-medium text-fog-700 hover:bg-white disabled:opacity-50"
      >
        Refresh
      </button>
    </div>
  )
}
