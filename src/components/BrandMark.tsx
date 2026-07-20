/** KTN Port mark — clean dock / pier silhouette. */
export function BrandMark({
  className = 'h-9 w-9',
  title = 'KTN Port',
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="40" height="40" rx="10" fill="#16352F" />
      <circle cx="30" cy="10" r="2.75" fill="#E8C56A" />
      <rect x="7.5" y="16" width="25" height="3.25" rx="1" fill="#E8C56A" />
      <rect x="10" y="19.25" width="3.25" height="10" rx="1" fill="#7EB8B2" />
      <rect x="18.4" y="19.25" width="3.25" height="10" rx="1" fill="#7EB8B2" />
      <rect x="26.75" y="19.25" width="3.25" height="10" rx="1" fill="#7EB8B2" />
      <path
        d="M6.5 33.5c3.2-2.4 6.4-2.4 9.5 0s6.4 2.4 9.5 0 6.4-2.4 9.5 0"
        stroke="#C8D9D4"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function BrandWordmark({
  invert = false,
  subtitle = 'Ketchikan cruise crowds',
}: {
  invert?: boolean
  subtitle?: string
}) {
  return (
    <span className="min-w-0">
      <span
        className={[
          'block font-display text-[1.1rem] font-semibold leading-none tracking-tight',
          invert ? 'text-fog-50' : 'text-spruce-900 group-hover:text-spruce-700',
        ].join(' ')}
      >
        KTN Port
      </span>
      {subtitle ? (
        <span
          className={[
            'mt-0.5 block text-[0.68rem] font-medium tracking-[0.08em] uppercase',
            invert ? 'text-channel-200' : 'text-fog-500',
          ].join(' ')}
        >
          {subtitle}
        </span>
      ) : null}
    </span>
  )
}
