import { useState } from 'react'
import {
  getNotifyPrefs,
  requestNotifyPermission,
  setNotifyPrefs,
} from '../lib/notifications'
import type { NotifyPrefs } from '../types'

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotifyPrefs>(() => getNotifyPrefs())
  const [status, setStatus] = useState<string | null>(null)

  const update = (patch: Partial<NotifyPrefs>) => {
    setPrefs(setNotifyPrefs(patch))
  }

  const enable = async () => {
    const permission = await requestNotifyPermission()
    if (permission !== 'granted') {
      setStatus('Notifications blocked in this browser. Enable them in site settings.')
      update({ enabled: false })
      return
    }
    update({ enabled: true })
    setStatus('Browser alerts on. We’ll nudge you on extreme or rain-relief days.')
  }

  return (
    <div className="rounded-2xl border border-fog-200 bg-white/80 p-5">
      <h3 className="font-display text-xl font-semibold text-spruce-900">
        Local alerts
      </h3>
      <p className="mt-1 text-sm text-fog-500">
        Browser notifications for extreme crowd days and rain-thinned busy days. SMS would
        need a separate messaging backend — alerts here stay on-device.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {!prefs.enabled ? (
          <button
            type="button"
            onClick={() => void enable()}
            className="rounded-full bg-spruce-900 px-4 py-2 text-sm font-semibold text-fog-50"
          >
            Enable alerts
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              update({ enabled: false })
              setStatus('Alerts paused.')
            }}
            className="rounded-full border border-fog-300 bg-white px-4 py-2 text-sm font-semibold text-fog-700"
          >
            Pause alerts
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <label className="flex items-center gap-2 text-fog-700">
          <input
            type="checkbox"
            checked={prefs.extremeDays}
            onChange={(e) => update({ extremeDays: e.target.checked })}
            className="accent-spruce-700"
          />
          Extreme crowd days
        </label>
        <label className="flex items-center gap-2 text-fog-700">
          <input
            type="checkbox"
            checked={prefs.rainRelief}
            onChange={(e) => update({ rainRelief: e.target.checked })}
            className="accent-spruce-700"
          />
          Rain-relief days (busy on paper, softer ashore)
        </label>
      </div>
      {status && <p className="mt-3 text-xs text-channel-700">{status}</p>}
    </div>
  )
}
