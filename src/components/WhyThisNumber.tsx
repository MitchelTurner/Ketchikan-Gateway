export function WhyThisNumber({ why }: { why: string }) {
  return (
    <p className="rounded-xl border border-spruce-900/10 bg-spruce-900/[0.04] px-4 py-3 text-sm text-fog-700">
      <span className="font-semibold text-spruce-800">Why this number: </span>
      {why}
    </p>
  )
}
