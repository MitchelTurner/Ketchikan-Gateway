import type { DayForecast, NotifyPrefs } from '../types'

const PREFS_KEY = 'ktn-gateway-notify-prefs'

export const DEFAULT_NOTIFY_PREFS: NotifyPrefs = {
  enabled: false,
  extremeDays: true,
  rainRelief: true,
  lastNotifiedDate: null,
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

export function maybeNotifyForDay(day: DayForecast): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const prefs = getNotifyPrefs()
  if (!prefs.enabled) return
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

  new Notification('Ketchikan Gateway', {
    body: messages.join(' '),
    icon: '/favicon.svg',
    tag: `ktn-${day.date}`,
  })
  setNotifyPrefs({ lastNotifiedDate: day.date })
}
