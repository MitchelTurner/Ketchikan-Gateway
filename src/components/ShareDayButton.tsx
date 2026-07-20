import { useState } from 'react'
import { Link } from 'react-router-dom'
import { facebookShareText } from '../lib/downtownNow'
import { formatShortDate } from '../lib/utils'
import type { DayForecast } from '../types'

export function ShareDayButton({
  day,
  compact = false,
}: {
  day: DayForecast
  compact?: boolean
}) {
  const [status, setStatus] = useState<string | null>(null)
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/schedule/${day.date}`
      : `/schedule/${day.date}`

  const summary = `${formatShortDate(day.date)} in Ketchikan: ${day.verdictLabel} — ${day.predictedDowntown.toLocaleString()} passengers predicted ashore. ${day.why}`

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'KTN Port', text: summary, url })
        setStatus('Shared')
        return
      }
      await navigator.clipboard.writeText(`${summary}\n${url}`)
      setStatus('Copied')
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        setStatus('Copied')
      } catch {
        setStatus('Share failed')
      }
    }
  }

  const copyFacebook = async () => {
    const text = `${facebookShareText(day)}\n${url}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus('FB text copied')
    } catch {
      window.prompt('Copy this for Facebook:', text)
    }
  }

  const btn =
    'inline-flex min-h-10 items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold sm:min-h-0 sm:px-4'

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'w-full sm:w-auto' : ''}`}>
      <button
        type="button"
        onClick={() => void share()}
        className={`${btn} bg-spruce-900 text-fog-50`}
      >
        Share
      </button>
      <button
        type="button"
        onClick={() => void copyFacebook()}
        className={`${btn} border border-[#1877F2]/40 bg-[#1877F2]/10 text-[#166FE5] ${compact ? 'hidden sm:inline-flex' : ''}`}
      >
        Facebook
      </button>
      <Link
        to={`/schedule/${day.date}`}
        className={`${btn} border border-fog-300 bg-white/80 text-fog-700 no-underline ${compact ? 'hidden sm:inline-flex' : ''}`}
      >
        Day card
      </Link>
      {status && <span className="text-xs text-channel-700">{status}</span>}
    </div>
  )
}
