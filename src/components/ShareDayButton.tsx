import { useState } from 'react'
import type { DayForecast } from '../types'
import { formatShortDate } from '../lib/utils'

export function ShareDayButton({ day }: { day: DayForecast }) {
  const [status, setStatus] = useState<string | null>(null)
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/day/${day.date}`
      : `/day/${day.date}`

  const summary = `${formatShortDate(day.date)} in Ketchikan: ${day.verdictLabel} — ${day.predictedDowntown.toLocaleString()} passengers predicted ashore. ${day.why}`

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ketchikan Gateway', text: summary, url })
        setStatus('Shared.')
        return
      }
      await navigator.clipboard.writeText(`${summary}\n${url}`)
      setStatus('Link copied.')
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        setStatus('Link copied.')
      } catch {
        setStatus('Could not share from this browser.')
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void share()}
        className="rounded-full bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50"
      >
        Share this day
      </button>
      <a
        href={`/day/${day.date}`}
        className="rounded-full border border-fog-300 bg-white/80 px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
      >
        Day card
      </a>
      {status && <span className="text-xs text-channel-700">{status}</span>}
    </div>
  )
}
