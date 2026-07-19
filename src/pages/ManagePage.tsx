import { useMemo, useState } from 'react'
import { NotificationSettings } from '../components/NotificationSettings'
import { getPredictionLog, setActualForDate, accuracyStats } from '../lib/accuracy'
import {
  clearActualOverride,
  setActualOverride,
} from '../lib/actualOverrides'
import { parseShipVisitsCsv } from '../lib/csv'
import { PORT_SOURCES } from '../lib/portSources'
import {
  importVisitsToPocketBase,
  isAdminAuthed,
  loginAdmin,
  logoutAdmin,
  updateVisitActual,
} from '../lib/ships'
import { useGateway } from '../hooks/GatewayContext'
import { formatShortDate, todayInAlaska } from '../lib/utils'

export function ManagePage() {
  const { getDay, refetch, source, accuracy, calibrationBias } = useGateway()
  const today = todayInAlaska()
  const day = getDay(today)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(() => isAdminAuthed())
  const [msg, setMsg] = useState<string | null>(null)
  const [csvPreview, setCsvPreview] = useState<number | null>(null)
  const [importing, setImporting] = useState(false)
  const [actualDrafts, setActualDrafts] = useState<Record<string, string>>({})
  const [dayActual, setDayActual] = useState('')

  const [logTick, setLogTick] = useState(0)
  const log = useMemo(() => getPredictionLog().slice(-12).reverse(), [logTick])
  const stats = accuracy.samples ? accuracy : accuracyStats()
  const bumpLog = () => setLogTick((t) => t + 1)

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginAdmin(email, password)
      setAuthed(true)
      setMsg('Signed in to PocketBase.')
      setPassword('')
    } catch {
      setMsg('Login failed. Check email/password or use local actual overrides.')
    }
  }

  const onCsv = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    const { rows, errors } = parseShipVisitsCsv(text)
    setCsvPreview(rows.length)
    if (errors.length) {
      setMsg(errors.slice(0, 3).join(' · '))
      return
    }
    if (!authed) {
      setMsg(
        `Parsed ${rows.length} rows. Sign in to import into PocketBase, or keep using bundled/local data.`,
      )
      return
    }
    setImporting(true)
    try {
      const result = await importVisitsToPocketBase(rows)
      setMsg(
        `Imported ${result.created} visits.${result.errors.length ? ` ${result.errors.length} errors.` : ''}`,
      )
      await refetch()
    } finally {
      setImporting(false)
    }
  }

  const saveShipActual = async (visitId: string) => {
    const n = Number(actualDrafts[visitId])
    if (!Number.isFinite(n) || n < 0) {
      setMsg('Enter a valid passenger count.')
      return
    }
    setActualOverride(visitId, n)
    if (authed) {
      try {
        await updateVisitActual(visitId, n)
        setMsg(`Saved actual ${n.toLocaleString()} to PocketBase.`)
      } catch {
        setMsg(`Saved locally (${n.toLocaleString()}); PocketBase update failed.`)
      }
    } else {
      setMsg(`Saved actual ${n.toLocaleString()} locally (tunes the model).`)
    }
    await refetch()
    bumpLog()
  }

  const saveDayActual = () => {
    const n = Number(dayActual)
    if (!Number.isFinite(n) || n < 0) {
      setMsg('Enter a valid day total.')
      return
    }
    setActualForDate(today, n)
    setMsg(`Logged ${n.toLocaleString()} actual passengers for ${today}.`)
    bumpLog()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-spruce-900">Manage</h1>
        <p className="mt-2 max-w-2xl text-fog-600">
          Import schedules, log actuals to tune predictions, check official port sources, and
          set local alerts. Current data source: {source}.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Model bias', value: `×${calibrationBias.toFixed(2)}` },
          { label: 'Accuracy samples', value: String(stats.samples) },
          {
            label: 'Mean error',
            value: stats.samples
              ? `${stats.meanAbsError.toLocaleString()} (${stats.meanAbsPercentError}%)`
              : '—',
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-fog-200 bg-white/70 px-4 py-4">
            <p className="text-[0.7rem] font-semibold tracking-wide text-fog-400 uppercase">
              {s.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-spruce-900">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      <NotificationSettings />

      <section className="rounded-2xl border border-fog-200 bg-white/80 p-5">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          PocketBase admin
        </h2>
        {!authed ? (
          <form onSubmit={(e) => void doLogin(e)} className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-fog-300 px-3 py-2 text-sm"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-fog-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-xl bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50"
            >
              Sign in
            </button>
          </form>
        ) : (
          <div className="mt-3 flex items-center gap-3">
            <p className="text-sm text-spruce-700">Signed in</p>
            <button
              type="button"
              onClick={() => {
                logoutAdmin()
                setAuthed(false)
                setMsg('Signed out.')
              }}
              className="rounded-full border border-fog-300 px-3 py-1 text-xs font-semibold"
            >
              Sign out
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-fog-200 bg-white/80 p-5">
        <h2 className="font-display text-xl font-semibold text-spruce-900">CSV import</h2>
        <p className="mt-1 text-sm text-fog-500">
          Columns: date, ship / ship_name, arrival, departure, berth, estimated_passengers /
          passengers / capacity, actual_passengers / actual_pax / actual, direction, notes.
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          className="mt-4 block text-sm"
          disabled={importing}
          onChange={(e) => void onCsv(e.target.files?.[0] ?? null)}
        />
        {csvPreview != null && (
          <p className="mt-2 text-xs text-fog-500">{csvPreview} rows ready</p>
        )}
      </section>

      <section className="rounded-2xl border border-fog-200 bg-white/80 p-5">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Today’s actuals — {formatShortDate(today)}
        </h2>
        <p className="mt-1 text-sm text-fog-500">
          Logging actuals tunes the ashore factor for future days. Local overrides apply even
          without admin login.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block text-fog-500">Day total actual ashore</span>
            <input
              type="number"
              min={0}
              value={dayActual}
              onChange={(e) => setDayActual(e.target.value)}
              className="w-40 rounded-xl border border-fog-300 px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={saveDayActual}
            className="rounded-xl bg-channel-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Log day actual
          </button>
        </div>

        <ul className="mt-6 divide-y divide-fog-200">
          {day.ships.length === 0 && (
            <li className="py-4 text-sm text-fog-500">No ships today.</li>
          )}
          {day.ships.map((ship) => (
            <li
              key={ship.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-spruce-900">{ship.ship}</p>
                <p className="text-xs text-fog-500">
                  Est. {ship.estimated_passengers.toLocaleString()}
                  {ship.actual_passengers > 0
                    ? ` · actual ${ship.actual_passengers.toLocaleString()}`
                    : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Actual"
                  value={actualDrafts[ship.id] ?? ''}
                  onChange={(e) =>
                    setActualDrafts((d) => ({ ...d, [ship.id]: e.target.value }))
                  }
                  className="w-28 rounded-xl border border-fog-300 px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void saveShipActual(ship.id)}
                  className="rounded-full bg-spruce-900 px-3 py-1.5 text-xs font-semibold text-fog-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearActualOverride(ship.id)
                    void refetch()
                    setMsg('Cleared local override.')
                  }}
                  className="rounded-full border border-fog-300 px-3 py-1.5 text-xs font-semibold text-fog-600"
                >
                  Clear
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-fog-200 bg-white/80 p-5">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Official port sources
        </h2>
        <p className="mt-1 text-sm text-fog-500">
          Verify cancellations and berth changes against the Port of Ketchikan. PDFs update
          through the season.
        </p>
        <ul className="mt-4 space-y-3">
          {PORT_SOURCES.map((s) => (
            <li key={s.title}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-channel-700 underline-offset-2 hover:underline"
              >
                {s.title}
              </a>
              <p className="text-xs text-fog-500">{s.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-fog-200 bg-white/80 p-5">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Prediction log
        </h2>
        <ul className="mt-3 divide-y divide-fog-100 text-sm">
          {log.length === 0 && (
            <li className="py-3 text-fog-500">No logged forecasts yet.</li>
          )}
          {log.map((e) => (
            <li key={e.date} className="flex flex-wrap justify-between gap-2 py-2">
              <span className="font-medium text-spruce-900">{e.date}</span>
              <span className="text-fog-600">
                pred {e.predicted.toLocaleString()}
                {e.actual != null ? ` · actual ${e.actual.toLocaleString()}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {msg && (
        <p className="rounded-xl border border-channel-200 bg-channel-50 px-4 py-3 text-sm text-channel-700">
          {msg}
        </p>
      )}
    </div>
  )
}
