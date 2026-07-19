/** KTN Port logo mark — pier + KTN monogram */
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
      <rect x="6" y="17.5" width="28" height="2.5" rx="0.8" fill="#E8C56A" />
      <rect x="8.5" y="20" width="2.5" height="9" rx="0.6" fill="#7EB8B2" />
      <rect x="18.75" y="20" width="2.5" height="9" rx="0.6" fill="#7EB8B2" />
      <rect x="29" y="20" width="2.5" height="9" rx="0.6" fill="#7EB8B2" />
      <path
        d="M5 32c2.5-1.8 5-1.8 7.5 0s5 1.8 7.5 0 5-1.8 7.5 0 5 1.8 7.5 0"
        stroke="#C8D9D4"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="20"
        y="13.5"
        textAnchor="middle"
        fill="#F4F7F8"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="Outfit, ui-sans-serif, system-ui, sans-serif"
        letterSpacing="1.1"
      >
        KTN
      </text>
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
    <span>
      <span
        className={[
          'block font-display text-[1.15rem] font-semibold leading-none tracking-tight',
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
