import { NavLink, Outlet } from 'react-router-dom'
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
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-spruce-900/10 bg-[#f4f7f8]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <NavLink to="/" className="group no-underline">
              <span className="block font-display text-[1.15rem] font-semibold leading-none tracking-[0.06em] text-spruce-900 group-hover:text-spruce-700">
                KTN PORT
              </span>
              <span className="mt-1 block text-[0.65rem] font-medium tracking-[0.1em] text-fog-500 uppercase">
                Ketchikan cruise crowds
              </span>
            </NavLink>

            <nav
              className="flex flex-wrap items-center justify-end gap-1 sm:gap-2"
              aria-label="Primary"
            >
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors',
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

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="mt-auto border-t border-spruce-900/10 bg-spruce-950 text-fog-200">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
              <div>
                <p className="font-display text-lg tracking-[0.06em] text-fog-50">
                  KTN PORT
                </p>
                <p className="mt-1 max-w-md text-sm text-fog-300">
                  Unofficial cruise passenger forecasts for downtown Ketchikan. Schedules
                  change — confirm with the Port when it matters.
                </p>
              </div>
              <nav
                className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm"
                aria-label="Footer"
              >
                {[
                  { to: '/schedule', label: 'Schedule' },
                  { to: '/ships', label: 'Ships' },
                  { to: '/stats', label: 'Stats' },
                  { to: '/berths', label: 'Berths' },
                  { to: '/guides', label: 'Guides' },
                  { to: '/insights', label: 'Weather × Crowds' },
                  { to: '/about', label: 'About' },
                  { to: '/data-sources', label: 'Data sources' },
                ].map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className="text-fog-300 no-underline hover:text-fog-50"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <p className="text-xs text-fog-400">
              Mitchel Turner Dev, LLC · ktnport.com · Data:{' '}
              {data.source === 'pocketbase' ? 'live port DB' : 'bundled schedule'}
              {data.weatherLive ? ' · weather: Open-Meteo' : ' · weather: seasonal model'}
              {data.lastUpdated
                ? ` · refreshed ${data.lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Anchorage' })} Alaska`
                : ''}
            </p>
          </div>
        </footer>
      </div>
    </GatewayContext.Provider>
  )
}
