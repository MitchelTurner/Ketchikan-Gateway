import type { DayForecast, NotifyPrefs } from '../types'
import { currentAlaskaHour } from './utils'

const PREFS_KEY = 'ktn-gateway-notify-prefs'

export const DEFAULT_NOTIFY_PREFS: NotifyPrefs = {
  enabled: false,
  extremeDays: true,
  rainRelief: true,
  morningDigest: true,
  lastNotifiedDate: null,
  lastDigestDate: null,
}

export function getNotifyPrefs(): NotifyPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULT_NOTIFY_PREFS }
    return { ...DEFAULT_NOTIFY_PREFS, ...(JSON.parse(raw) as NotifyPrefs) }
  } catch {
    return { ...DEFAULT_NOTIFY_PREFS }
  }
}

export function setNotifyPrefs(prefs: Partial<NotifyPrefs>): NotifyPrefs {
  const next = { ...getNotifyPrefs(), ...prefs }
  localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  return next
}

export async function requestNotifyPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

function notify(body: string, tag: string) {
  new Notification('KTN Port', {
    body,
    icon: '/ktn_logo-192.png',
    tag,
  })
}

export function maybeNotifyForDay(day: DayForecast, tomorrow?: DayForecast): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const prefs = getNotifyPrefs()
  if (!prefs.enabled) return

  const hour = currentAlaskaHour()

  // Morning digest 6–9 AM AK
  if (
    prefs.morningDigest &&
    hour >= 6 &&
    hour <= 9 &&
    prefs.lastDigestDate !== day.date
  ) {
    const tom =
      tomorrow && tomorrow.ships.length
        ? ` Tomorrow: ${tomorrow.verdictLabel.toLowerCase()}, ${tomorrow.predictedDowntown.toLocaleString()} ashore.`
        : ''
    notify(
      `Today: ${day.verdictLabel} — ${day.predictedDowntown.toLocaleString()} predicted ashore.${tom}`,
      `ktn-digest-${day.date}`,
    )
    setNotifyPrefs({ lastDigestDate: day.date, lastNotifiedDate: day.date })
    return
  }

  if (prefs.lastNotifiedDate === day.date) return

  const messages: string[] = []
  if (prefs.extremeDays && day.weatherAdjustedCrowd === 'extreme') {
    messages.push(
      `Extreme crowd day — ${day.predictedDowntown.toLocaleString()} predicted ashore. ${day.verdictLabel}.`,
    )
  }
  if (
    prefs.rainRelief &&
    day.rainRelief >= 1500 &&
    (day.dropsCrowdBand || day.crowdLevel === 'busy' || day.crowdLevel === 'extreme')
  ) {
    messages.push(
      `Rain relief: ~${day.rainRelief.toLocaleString()} fewer ashore than a clear day.`,
    )
  }

  if (messages.length === 0) return

  notify(messages.join(' '), `ktn-${day.date}`)
  setNotifyPrefs({ lastNotifiedDate: day.date })
}
