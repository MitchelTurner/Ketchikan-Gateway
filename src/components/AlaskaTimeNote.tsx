export function AlaskaTimeNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-fog-500 ${className}`}>
      All times shown in <strong className="font-semibold text-fog-700">Alaska time</strong>{' '}
      (America/Anchorage).
    </p>
  )
}
