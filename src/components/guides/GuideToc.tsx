import type { GuideSection } from '../../data/guides'
import { sectionDomId } from '../../lib/guideHelpers'

type Props = {
  sections: GuideSection[]
  includeTours?: boolean
  includeFaq?: boolean
}

export function GuideToc({ sections, includeTours, includeFaq = true }: Props) {
  const items = [
    ...sections.map((s) => ({ id: sectionDomId(s), label: s.heading })),
    ...(includeTours
      ? [{ id: 'bookable-tours', label: 'Bookable tours' }]
      : []),
    ...(includeFaq ? [{ id: 'faq', label: 'FAQ' }] : []),
  ]

  if (items.length < 2) return null

  return (
    <nav
      aria-label="On this page"
      className="guide-toc sticky top-[4.25rem] z-20 rounded-xl border border-fog-200 bg-white/90 px-3 py-3 shadow-sm backdrop-blur-md print:static print:shadow-none"
    >
      <p className="text-[0.65rem] font-semibold tracking-wider text-fog-400 uppercase">
        On this page
      </p>
      <ol className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2">
            {i > 0 && <span className="text-fog-300" aria-hidden>·</span>}
            <a
              href={`#${item.id}`}
              className="font-medium text-channel-700 no-underline hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
