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

export function StickyGoDowntown({ day }: { day: DayForecast }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])

  void tick
  const answer = shouldGoDowntown(day)
  const snap = currentShoreSnapshot(day)

  return (
    <div
      className={`sticky top-[3.6rem] z-30 border-b ${TONE[answer.verdict]}`}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase opacity-80">
            Should I go downtown?
          </p>
          <p className="font-display text-lg font-semibold leading-tight sm:text-xl">
            {answer.short}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-black/15 px-2.5 py-1">
            {answer.label}
          </span>
          <span className="rounded-full bg-black/15 px-2.5 py-1 tabular-nums">
            ~{snap.passengers.toLocaleString()} ashore now
          </span>
          <span className="rounded-full bg-black/15 px-2.5 py-1">
            {snap.shipsNow.length} ship{snap.shipsNow.length === 1 ? '' : 's'} in
          </span>
        </div>
      </div>
    </div>
  )
}
