/** KTN Port mark — geometric K + harbor arc (works at favicon size). */
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
      <defs>
        <linearGradient id="ktnPortGrad" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2A6B6E" />
          <stop offset="1" stopColor="#16352F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="#16352F" />
      <rect width="40" height="40" rx="11" fill="url(#ktnPortGrad)" opacity="0.55" />
      <circle cx="29" cy="11.5" r="2.4" fill="#E8C56A" />
      <path
        d="M12.5 8.5v23M12.5 20l11.5-10M12.5 20l9 9"
        stroke="#F4F7F8"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21.5 29c3.8 0 7.5-1.9 10-5"
        stroke="#7EB8B2"
        strokeWidth="2.2"
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
          'block font-display text-[1.2rem] font-semibold leading-none tracking-[-0.02em]',
          invert ? 'text-fog-50' : 'text-spruce-900 group-hover:text-spruce-700',
        ].join(' ')}
      >
        <span className="tracking-[0.04em]">KTN</span>
        <span className="font-medium opacity-90"> Port</span>
      </span>
      {subtitle ? (
        <span
          className={[
            'mt-1 block text-[0.65rem] font-medium tracking-[0.12em] uppercase',
            invert ? 'text-channel-200' : 'text-fog-500',
          ].join(' ')}
        >
          {subtitle}
        </span>
      ) : null}
    </span>
  )
}
