type Props = {
  className?: string
  title?: string
}

/** Uploaded KTN Port mark (whale + tall ship). */
export function BrandMark({
  className = 'h-9 w-9',
  title = 'KTN Port',
}: Props) {
  return (
    <img
      src="/ktn_logo.png"
      alt={title}
      width={512}
      height={512}
      className={`rounded-[22%] object-cover ${className}`}
      decoding="async"
    />
  )
}

export function BrandWordmark({
  invert = false,
  subtitle = 'Ketchikan cruise crowds',
}: {
  invert?: boolean
  subtitle?: string | null
}) {
  return (
    <span className="min-w-0">
      <span
        className={[
          'block font-display text-base font-semibold leading-none tracking-[0.06em] sm:text-[1.15rem]',
          invert ? 'text-fog-50' : 'text-spruce-900 group-hover:text-spruce-700',
        ].join(' ')}
      >
        KTN PORT
      </span>
      {subtitle ? (
        <span
          className={[
            'mt-0.5 hidden text-[0.65rem] font-medium tracking-[0.1em] uppercase sm:block',
            invert ? 'text-channel-200' : 'text-fog-500',
          ].join(' ')}
        >
          {subtitle}
        </span>
      ) : null}
    </span>
  )
}
