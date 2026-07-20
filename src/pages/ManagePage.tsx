import { useMemo, useState } from 'react'
import { getPredictionLog, setActualForDate, accuracyStats } from '../lib/accuracy'
import {
  clearActualOverride,
  setActualOverride,
} from '../lib/actualOverrides'
import { setVisitCancelled } from '../lib/cancellations'
import { parseShipVisitsCsv } from '../lib/csv'
import { PORT_SOURCES } from '../lib/portSources'
import { setLastVerified } from '../lib/verified'
import {
  importVisitsToPocketBase,
  isAdminAuthed,
  loginAdmin,
  logoutAdmin,
  updateVisitActual,
} from '../lib/ships'
import { Seo } from '../components/Seo'
import { useGateway } from '../hooks/GatewayContext'
import { buildMeta } from '../lib/seo/meta'
import { formatShortDate, todayInAlaska } from '../lib/utils'

export function ManagePage() {
  const manageMeta = buildMeta({ type: 'manage' })
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
      setMsg('Signed in.')
      setPassword('')
    } catch {
      setMsg('Login failed. Check email and password.')
    }
  }

  const onCsv = async (file: File | null) => {
    if (!file || !authed) return
    const text = await file.text()
    const { rows, errors } = parseShipVisitsCsv(text)
    setCsvPreview(rows.length)
    if (errors.length) {
      setMsg(errors.slice(0, 3).join(' · '))
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
    if (!authed) return
    const n = Number(actualDrafts[visitId])
    if (!Number.isFinite(n) || n < 0) {
      setMsg('Enter a valid passenger count.')
      return
    }
    setActualOverride(visitId, n)
    try {
      await updateVisitActual(visitId, n)
      setLastVerified(today)
      setMsg(`Saved actual ${n.toLocaleString()} to PocketBase.`)
    } catch {
      setLastVerified(today)
      setMsg(`Saved locally (${n.toLocaleString()}); PocketBase update failed.`)
    }
    await refetch()
    bumpLog()
  }

  const saveDayActual = () => {
    if (!authed) return
    const n = Number(dayActual)
    if (!Number.isFinite(n) || n < 0) {
      setMsg('Enter a valid day total.')
      return
    }
    setActualForDate(today, n)
    setLastVerified(today)
    setMsg(`Logged ${n.toLocaleString()} actual passengers for ${today}.`)
    bumpLog()
  }

  const toggleCancel = (visitId: string, currently: boolean) => {
    setVisitCancelled(visitId, !currently)
    void refetch()
    setMsg(!currently ? 'Marked cancelled for local forecasts.' : 'Restored visit.')
  }

  const downloadCsvTemplate = () => {
    const header =
      'date,ship,arrival,departure,berth,direction,estimated_passengers,actual_passengers,notes\n'
    const sample =
      '2026-07-20,EXAMPLE SHIP,07:00,16:00,2,N,2800,0,\n'
    const blob = new Blob([header + sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ketchikan-ship-visits-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
        <Seo meta={manageMeta} />
        <h1 className="font-display text-3xl font-semibold text-spruce-900">Admin sign in</h1>
        <p className="mt-2 text-sm text-fog-500">
          Operator tools are restricted. Sign in with your PocketBase account to continue.
        </p>
        <form onSubmit={(e) => void doLogin(e)} className="mt-8 space-y-3">
          <input
            type="email"
            required
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-fog-300 px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-fog-300 px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-spruce-900 px-4 py-2.5 text-sm font-semibold text-fog-50"
          >
            Sign in
          </button>
        </form>
        {msg && (
          <p className="mt-4 rounded-xl border border-alert-100 bg-alert-100/60 px-4 py-3 text-sm text-alert-600">
            {msg}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo meta={manageMeta} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-spruce-900">Manage</h1>
          <p className="mt-2 max-w-2xl text-fog-600">
            Import schedules, log actuals to tune predictions, and check official port sources.
            Data source: {source}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logoutAdmin()
            setAuthed(false)
            setMsg(null)
          }}
          className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700"
        >
          Sign out
        </button>
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

      <section className="rounded-2xl border border-fog-200 bg-white/80 p-5">
        <h2 className="font-display text-xl font-semibold text-spruce-900">
          Season import
        </h2>
        <p className="mt-1 text-sm text-fog-500">
          Pull the latest official capacity / berthing calendar from the Port of Ketchikan,
          convert rows to CSV, then import below. One-tap opens the source PDFs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://www.ketchikan.gov/media/Tourism/cruise-schedule-daily-capacities-20260428.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-channel-600 px-4 py-2 text-sm font-semibold text-white no-underline"
          >
            Open capacity calendar PDF
          </a>
          <a
            href="https://www.ketchikan.gov/port"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700 no-underline"
          >
            Port berthing page
          </a>
          <button
            type="button"
            onClick={downloadCsvTemplate}
            className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700"
          >
            Download CSV template
          </button>
          <button
            type="button"
            onClick={() => {
              setLastVerified(today)
              setMsg(
                `Marked schedule checked against Port PDF for ${today}. Shown on the public Today page.`,
              )
            }}
            className="rounded-full border border-spruce-700 bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50"
          >
            Mark schedule checked
          </button>
        </div>
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
          Logging actuals tunes the ashore factor for future days.
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
                <button
                  type="button"
                  onClick={() => toggleCancel(ship.id, Boolean(ship.cancelled))}
                  className="rounded-full border border-alert-100 bg-alert-100/50 px-3 py-1.5 text-xs font-semibold text-alert-600"
                >
                  {ship.cancelled ? 'Undo cancel' : 'Cancel call'}
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
          Verify cancellations and berth changes against the Port of Ketchikan.
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
