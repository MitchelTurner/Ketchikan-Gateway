import { useState } from 'react'
import type { Guide } from '../../data/guides'
import { useGateway } from '../../hooks/GatewayContext'
import { buildDayPlanText } from '../../lib/guideHelpers'
import { gygLocationUrl } from '../../lib/getyourguide'
import { absoluteUrl } from '../../lib/seo/site'
import { CROWD_META, todayInAlaska } from '../../lib/utils'

type Props = {
  guide: Guide
}

export function GuideDayPlan({ guide }: Props) {
  const { getDay } = useGateway()
  const todayIso = todayInAlaska()
  const day = getDay(todayIso)
  const ships = day.ships.filter((s) => !s.cancelled).length
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const stops = guide.sections
    .flatMap((s) => s.items?.map((i) => i.name) ?? [])
    .slice(0, 3)

  async function copyPlan() {
    const text = buildDayPlanText({
      guideTitle: guide.title,
      crowdLabel: CROWD_META[day.weatherAdjustedCrowd].label,
      shipCount: ships,
      stops,
      scheduleUrl: absoluteUrl(`/schedule/${todayIso}`),
      toursUrl: gygLocationUrl('ktn-day-plan'),
    })
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 2200)
    } catch {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2200)
    }
  }

  function printGuide() {
    window.print()
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={() => void copyPlan()}
        className="rounded-full border border-spruce-800/20 bg-spruce-900 px-3.5 py-2 text-sm font-semibold text-fog-50 transition hover:bg-spruce-800"
      >
        {status === 'copied' ? 'Copied day plan' : 'Copy day plan'}
      </button>
      <button
        type="button"
        onClick={printGuide}
        className="rounded-full border border-fog-300 bg-white px-3.5 py-2 text-sm font-semibold text-fog-700 transition hover:border-channel-400"
      >
        Print / save offline
      </button>
      {status === 'error' && (
        <span className="self-center text-xs text-alert-600">
          Couldn’t copy — try selecting the page text.
        </span>
      )}
    </div>
  )
}
