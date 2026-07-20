import { formatVerified, getLastVerified } from '../lib/verified'

const PORT_PDF =
  'https://www.ketchikan.gov/media/Tourism/cruise-schedule-daily-capacities-20260428.pdf'

export function LastVerifiedBanner() {
  const v = getLastVerified()

  if (!v) {
    return (
      <p className="text-xs text-fog-500">
        Schedule not marked checked against the{' '}
        <a
          href={PORT_PDF}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-channel-700 underline-offset-2 hover:underline"
        >
          Port of Ketchikan cruise PDF
        </a>
        yet. Admins: Manage → Mark schedule checked.
      </p>
    )
  }

  return (
    <p className="text-xs text-fog-600">
      Last checked vs{' '}
      <a
        href={PORT_PDF}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-channel-700 underline-offset-2 hover:underline"
      >
        Port PDF
      </a>
      : <span className="font-medium text-spruce-800">{formatVerified(v.at)}</span>
      {v.date ? ` (for ${v.date})` : ''}. Cancellations can still land after that.
    </p>
  )
}
