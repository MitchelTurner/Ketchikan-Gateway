import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark, BrandWordmark } from './BrandMark'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useGatewayData } from '../hooks/useGatewayData'
import { GatewayContext } from '../hooks/GatewayContext'

const publicLinks = [
  { to: '/', label: 'Today', end: true },
  { to: '/schedule', label: 'Schedule', end: false },
  { to: '/ships', label: 'Ships', end: false },
  { to: '/guides', label: 'Guides', end: false },
]

export function Layout() {
  const data = useGatewayData()
  const isAdmin = useAdminAuth()
  const links = isAdmin
    ? [...publicLinks, { to: '/manage', label: 'Manage', end: false }]
    : publicLinks

  return (
    <GatewayContext.Provider value={data}>
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-spruce-900/10 bg-[#f4f7f8]/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
            <NavLink
              to="/"
              className="group flex min-w-0 shrink-0 items-center gap-2.5 no-underline sm:gap-3"
            >
              <BrandMark className="h-9 w-9 sm:h-10 sm:w-10" />
              <BrandWordmark subtitle="Ketchikan cruise crowds" />
            </NavLink>

            <nav
              className="-mx-1 flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Primary"
            >
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    [
                      'shrink-0 rounded-full px-2.5 py-1.5 text-xs font-medium no-underline transition-colors sm:px-3 sm:text-sm',
                      isActive
                        ? 'bg-spruce-900 text-fog-50'
                        : 'text-fog-700 hover:bg-spruce-900/8 hover:text-spruce-900',
                    ].join(' ')
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

        <footer className="mt-auto border-t border-spruce-900/10 bg-spruce-950 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-fog-200">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8 sm:gap-6 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <BrandMark className="h-11 w-11 shrink-0" />
                <div>
                  <BrandWordmark invert subtitle={null} />
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-fog-300">
                    Unofficial cruise passenger forecasts for downtown Ketchikan.
                  </p>
                </div>
              </div>
              <nav
                className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:gap-x-8"
                aria-label="Footer"
              >
                {[
                  { to: '/schedule', label: 'Schedule' },
                  { to: '/ships', label: 'Ships' },
                  { to: '/stats', label: 'Stats' },
                  { to: '/berths', label: 'Berths' },
                  { to: '/guides', label: 'Guides' },
                  { to: '/insights', label: 'Weather' },
                  { to: '/about', label: 'About' },
                  { to: '/data-sources', label: 'Data' },
                ].map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className="py-0.5 text-fog-300 no-underline hover:text-fog-50"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <p className="text-[0.7rem] leading-relaxed text-fog-400 sm:text-xs">
              Mitchel Turner Dev, LLC · ktnport.com
              {data.lastUpdated
                ? ` · refreshed ${data.lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Anchorage' })} AK`
                : ''}
            </p>
          </div>
        </footer>
      </div>
    </GatewayContext.Provider>
  )
}
