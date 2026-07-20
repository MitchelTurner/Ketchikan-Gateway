import { Link } from 'react-router-dom'

export type Crumb = { name: string; path: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-fog-500 sm:text-sm">
      <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.path} className="flex max-w-full items-center gap-1 sm:gap-1.5">
              {i > 0 && (
                <span className="text-fog-300" aria-hidden>
                  /
                </span>
              )}
              {last ? (
                <span
                  className="truncate font-medium text-spruce-800"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="shrink-0 text-channel-700 no-underline hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
