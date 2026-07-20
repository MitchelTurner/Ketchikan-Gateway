import { useEffect, useState } from 'react'
import {
  currentShoreSnapshot,
  shouldGoDowntown,
} from '../lib/downtownNow'
import type { DayForecast } from '../types'

const TONE = {
  quiet: 'bg-spruce-900 text-fog-50 border-spruce-800',
  okay: 'bg-busy-500 text-white border-busy-600',
  avoid: 'bg-alert-500 text-white border-alert-600',
} as const

function liveKey(day: DayForecast): string {
  const snap = currentShoreSnapshot(day)
  const a = shouldGoDowntown(day)
  return `${snap.hour}|${snap.shipsNow.length}|${a.verdict}|${a.short}`
}

export function StickyGoDowntown({ day }: { day: DayForecast }) {
  const [view, setView] = useState(() => ({
    key: liveKey(day),
    answer: shouldGoDowntown(day),
    snap: currentShoreSnapshot(day),
  }))

  const dayStamp = [
    day.date,
    day.verdict,
    day.predictedDowntown,
    day.ships.map((s) => `${s.id}:${s.cancelled ? 1 : 0}:${s.arrival}-${s.departure}`).join(','),
    day.hourlyCrowd.map((h) => `${h.hour}:${h.passengers}`).join(','),
  ].join('|')

  useEffect(() => {
    let settleTimer: number | undefined
    let pendingKey: string | null = null

    const apply = () => {
      const key = liveKey(day)
      const answer = shouldGoDowntown(day)
      const snap = currentShoreSnapshot(day)

      setView((prev) => {
        if (key === prev.key) {
          pendingKey = null
          if (
            prev.snap.passengers === snap.passengers &&
            prev.snap.shipsNow.length === snap.shipsNow.length &&
            prev.answer.short === answer.short
          ) {
            return prev
          }
          return { key, answer, snap }
        }

        if (pendingKey !== key) {
          pendingKey = key
          if (settleTimer) window.clearTimeout(settleTimer)
          settleTimer = window.setTimeout(() => {
            const settledKey = liveKey(day)
            if (settledKey !== key) return
            setView({
              key: settledKey,
              answer: shouldGoDowntown(day),
              snap: currentShoreSnapshot(day),
            })
            pendingKey = null
          }, 1200)
        }
        return prev
      })
    }

    apply()
    const id = window.setInterval(apply, 60_000)
    return () => {
      window.clearInterval(id)
      if (settleTimer) window.clearTimeout(settleTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dayStamp is the stable identity
  }, [dayStamp])

  const { answer, snap } = view
  const showStats = snap.shipsNow.length > 0

  return (
    <div className={`sticky top-[3.25rem] z-30 border-b sm:top-[3.6rem] ${TONE[answer.verdict]}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="min-w-0">
          <p className="truncate text-[0.6rem] font-semibold tracking-[0.12em] uppercase opacity-80 sm:text-[0.65rem]">
            Should I go downtown?
          </p>
          <p className="truncate font-display text-base font-semibold leading-tight sm:text-lg md:text-xl">
            {answer.short}
          </p>
        </div>
        {showStats ? (
          <div className="shrink-0 text-right">
            <p className="rounded-full bg-black/15 px-2.5 py-1 text-[0.65rem] font-semibold sm:text-xs">
              {answer.label}
            </p>
            <p className="mt-1 hidden text-[0.65rem] font-semibold opacity-90 sm:block">
              {snap.shipsNow.length} in · ~{snap.passengers.toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
