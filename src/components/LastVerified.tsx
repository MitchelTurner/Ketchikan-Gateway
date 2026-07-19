import { formatVerified, getLastVerified } from '../lib/verified'

export function LastVerifiedBanner() {
  const v = getLastVerified()
  if (!v) return null
  return (
    <p className="text-xs text-fog-500">
      Schedule actuals last verified {formatVerified(v.at)}
      {v.date ? ` (for ${v.date})` : ''}.
    </p>
  )
}
