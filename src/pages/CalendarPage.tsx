import { useMemo, useState } from 'react'
import { CrowdMeter } from '../components/CrowdMeter'
import { ShipList } from '../components/ShipList'
import { WeatherPanel } from '../components/WeatherPanel'
import { useGateway } from '../hooks/GatewayContext'
import {
  CROWD_META,
  daysInMonth,
  firstWeekday,
  formatMonthYear,
  formatShortDate,
  todayInAlaska,
} from '../lib/utils'
import type { CrowdLevel } from '../types'

const CELL: Record<CrowdLevel, string> = {
  low: 'bg-spruce-100 text-spruce-800 hover:bg-spruce-100/80',
  moderate: 'bg-channel-100 text-channel-700 hover:bg-channel-100/80',
  busy: 'bg-busy-100 text-busy-600 hover:bg-busy-100/90',
  extreme: 'bg-alert-100 text-alert-600 hover:bg-alert-100/90',
}

export function CalendarPage() {
  const today = todayInAlaska()
  const [y, m] = today.split('-').map(Number)
  const [year, setYear] = useState(y)
  const [month, setMonth] = useState(m - 1)
  const [selected, setSelected] = useState(today)
  const { getDay, loading } = useGateway()

  const cells = useMemo(() => {
    const lead = firstWeekday(year, month)
    const count = daysInMonth(year, month)
    return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)]
  }, [year, month])

  const selectedDay = getDay(selected)

  const prev = () => {
    if (month === 0) {
      setMonth(11)
      setYear((v) => v - 1)
    } else setMonth((v) => v - 1)
  }
  const next = () => {
    if (month === 11) {
      setMonth(0)
      setYear((v) => v + 1)
    } else setMonth((v) => v + 1)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-spruce-900">Ship calendar</h1>
          <p className="mt-1 text-sm text-fog-500">
            {loading
              ? 'Loading schedule…'
              : 'Pick a day for ships, weather, and predicted shore traffic.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-fog-300 bg-white/80 px-3 py-1.5 text-sm font-medium text-fog-700 hover:bg-white"
          >
            Prev
          </button>
          <p className="min-w-[10rem] text-center font-display text-lg font-semibold text-spruce-900">
            {formatMonthYear(year, month)}
          </p>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-fog-300 bg-white/80 px-3 py-1.5 text-sm font-medium text-fog-700 hover:bg-white"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-fog-600">
        {(Object.keys(CROWD_META) as CrowdLevel[]).map((level) => (
          <span key={level} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${CELL[level].split(' ')[0]}`} />
            {CROWD_META[level].label}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-fog-200 bg-white/70">
        <div className="grid grid-cols-7 border-b border-fog-200 bg-fog-50/80 text-center text-[0.7rem] font-semibold tracking-wide text-fog-500 uppercase">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="px-1 py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-fog-200">
          {cells.map((dayNum, idx) => {
            if (!dayNum) {
              return <div key={`e-${idx}`} className="min-h-[4.5rem] bg-fog-50/50" />
            }
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            const day = getDay(iso)
            const hasShips = day.ships.length > 0
            const isSelected = iso === selected
            const isToday = iso === today
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                className={[
                  'min-h-[4.5rem] p-2 text-left transition',
                  hasShips ? CELL[day.weatherAdjustedCrowd] : 'bg-white text-fog-400 hover:bg-fog-50',
                  isSelected ? 'ring-2 ring-inset ring-spruce-700' : '',
                  isToday && !isSelected ? 'ring-1 ring-inset ring-channel-400' : '',
                ].join(' ')}
              >
                <span className="text-xs font-semibold">{dayNum}</span>
                {hasShips && (
                  <>
                    <span className="mt-1 block text-[0.65rem] font-medium opacity-80">
                      {day.ships.length} ship{day.ships.length === 1 ? '' : 's'}
                    </span>
                    <span className="block text-[0.65rem] tabular-nums opacity-70">
                      {(day.predictedDowntown / 1000).toFixed(1)}k
                    </span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-spruce-900">
            {formatShortDate(selected)}
          </h2>
          <p className="text-sm text-fog-500">
            {selectedDay.ships.length} ship{selectedDay.ships.length === 1 ? '' : 's'} ·{' '}
            {selectedDay.predictedDowntown.toLocaleString()} predicted ashore
            {selectedDay.ships.length > 0 ? ` · ${selectedDay.verdictLabel}` : ''}
          </p>
          {selectedDay.ships.length > 0 && (
            <p className="mt-1 text-xs text-fog-500">{selectedDay.why}</p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <CrowdMeter
            level={selectedDay.weatherAdjustedCrowd}
            passengers={selectedDay.predictedDowntown}
            label="Weather-adjusted crowd"
          />
          {selectedDay.weather && <WeatherPanel weather={selectedDay.weather} />}
        </div>
        {selectedDay.rainRelief >= 1200 && (
          <p className="rounded-xl border border-channel-200 bg-channel-50 px-4 py-3 text-sm text-channel-700">
            Rain relief: ~{selectedDay.rainRelief.toLocaleString()} fewer ashore than a clear
            day.
          </p>
        )}
        <ShipList ships={selectedDay.ships} />
      </section>
    </div>
  )
}
