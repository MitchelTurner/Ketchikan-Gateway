import { useState } from 'react'
import { facebookShareText } from '../lib/downtownNow'
import { formatShortDate } from '../lib/utils'
import type { DayForecast } from '../types'

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
        await navigator.share({ title: 'KTN Port', text: summary, url })
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

  const copyFacebook = async () => {
    const text = `${facebookShareText(day)}\n${url}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Facebook text copied.')
    } catch {
      window.prompt('Copy this for Facebook:', text)
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
      <button
        type="button"
        onClick={() => void copyFacebook()}
        className="rounded-full border border-[#1877F2]/40 bg-[#1877F2]/10 px-4 py-2 text-sm font-semibold text-[#166FE5]"
      >
        Copy for Facebook
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
