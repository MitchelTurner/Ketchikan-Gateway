import { useEffect, useState } from 'react'
import { fetchMarineDay } from '../lib/tides'
import type { MarineDay } from '../types'

export function MarinePanel({ date }: { date: string }) {
  const [marine, setMarine] = useState<MarineDay | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    void fetchMarineDay(date)
      .then((m) => {
        if (alive) setMarine(m)
      })
      .catch(() => {
        if (alive) setError(true)
      })
    return () => {
      alive = false
    }
  }, [date])

  if (error) {
    return (
      <p className="rounded-2xl border border-fog-200 bg-white/60 px-4 py-3 text-sm text-fog-500">
        Marine / tide data unavailable right now.
      </p>
    )
  }

  if (!marine) {
    return (
      <p className="rounded-2xl border border-fog-200 bg-white/60 px-4 py-3 text-sm text-fog-500">
        Loading tides & wind…
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-channel-200 bg-white/80 p-5">
      <h3 className="font-display text-xl font-semibold text-spruce-900">
        Tide, wind & air
      </h3>
      <p className="mt-1 text-sm text-fog-500">
        For floatplanes and fishing alongside the cruise forecast.
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-channel-50 px-2 py-2">
          <dt className="text-fog-400">Wind</dt>
          <dd className="mt-0.5 font-semibold text-fog-800">{marine.windMph} mph</dd>
        </div>
        <div className="rounded-xl bg-channel-50 px-2 py-2">
          <dt className="text-fog-400">Gusts</dt>
          <dd className="mt-0.5 font-semibold text-fog-800">{marine.windGustMph} mph</dd>
        </div>
        <div className="rounded-xl bg-channel-50 px-2 py-2">
          <dt className="text-fog-400">Waves</dt>
          <dd className="mt-0.5 font-semibold text-fog-800">
            {marine.waveFt != null ? `${marine.waveFt} ft` : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-channel-700">{marine.floatplaneNote}</p>
      <p className="mt-1 text-sm text-fog-600">{marine.fishingNote}</p>
      {marine.tides.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {marine.tides.map((t) => (
            <li
              key={`${t.time}-${t.type}`}
              className="rounded-full border border-fog-200 bg-fog-50 px-2.5 py-1 text-[0.7rem] font-medium text-fog-700"
            >
              {t.type === 'H' ? 'High' : 'Low'} {t.time.slice(-5)} · {t.heightFt.toFixed(1)} ft
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
