/** GetYourGuide affiliate helpers for Ketchikan tour deep links. */

export const GYG_LOCATION = {
  name: 'Ketchikan',
  /** GetYourGuide location slug + id */
  path: '/ketchikan-l1256/',
  searchQuery: 'Ketchikan, Alaska',
} as const

/**
 * Partner / Cookie ID from the GetYourGuide Partner Portal
 * (Account → Account details). Set via Vite env.
 */
export function getGygPartnerId(): string | undefined {
  const id = import.meta.env.VITE_GETYOURGUIDE_PARTNER_ID?.trim()
  return id || undefined
}

export function gygUrl(
  pathOrUrl: string,
  opts?: { campaign?: string; partnerId?: string },
): string {
  const base = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `https://www.getyourguide.com${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
  const url = new URL(base)
  const partnerId = opts?.partnerId ?? getGygPartnerId()
  if (partnerId) url.searchParams.set('partner_id', partnerId)
  if (opts?.campaign) url.searchParams.set('cmp', opts.campaign)
  return url.toString()
}

export function gygLocationUrl(campaign = 'ktn-things-to-do'): string {
  return gygUrl(GYG_LOCATION.path, { campaign })
}

export function gygSearchUrl(query: string, campaign = 'ktn-things-to-do'): string {
  return gygUrl(`/s/?q=${encodeURIComponent(query)}`, { campaign })
}
