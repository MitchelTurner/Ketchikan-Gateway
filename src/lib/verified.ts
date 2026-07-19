const KEY = 'ktn-gateway-last-verified'

export function getLastVerified(): { at: string; date: string } | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as { at: string; date: string }) : null
  } catch {
    return null
  }
}

export function setLastVerified(date: string) {
  const payload = { at: new Date().toISOString(), date }
  localStorage.setItem(KEY, JSON.stringify(payload))
  return payload
}

export function formatVerified(at: string): string {
  return new Date(at).toLocaleString('en-US', {
    timeZone: 'America/Anchorage',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
