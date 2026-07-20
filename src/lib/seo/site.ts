export const SITE_URL = 'https://ktnport.com'
export const SITE_NAME = 'KTN Port'
export const ORG_NAME = 'Mitchel Turner Dev, LLC'
export const ORG_EMAIL = 'hello@ktnport.com'

export const PLACE = {
  name: 'Ketchikan, Alaska',
  latitude: 55.3422,
  longitude: -131.6461,
  timeZone: 'America/Anchorage',
  timeZoneLabel: 'Alaska time',
} as const

/** Absolute URL without trailing slash (except root). */
export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`
  const p = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${p.replace(/\/$/, '')}`
}
