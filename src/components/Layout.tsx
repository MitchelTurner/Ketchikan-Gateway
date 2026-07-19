import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark, BrandWordmark } from './BrandMark'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useGatewayData } from '../hooks/useGatewayData'
import { GatewayContext } from '../hooks/GatewayContext'

const publicLinks = [
  { to: '/', label: 'Today', end: true },
  { to: '/calendar', label: 'Calendar' },
  { to: '/activities', label: 'Activities' },
  { to: '/insights', label: 'Weather × Crowds' },
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
            <NavLink to="/" className="group flex items-center gap-2.5 no-underline">
              <BrandMark className="h-9 w-9 shrink-0 shadow-sm" />
              <BrandWordmark />
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
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <BrandMark className="h-10 w-10 shrink-0" />
              <div>
                <p className="font-display text-lg text-fog-50">KTN Port</p>
                <p className="mt-1 max-w-md text-sm text-fog-300">
                  Daily cruise passenger predictions for Ketchikan, cross-referenced with live
                  weather. ktnport.com — install as an app for offline schedule access.
                </p>
              </div>
            </div>
            <p className="text-xs text-fog-400">
              Data: {data.source === 'pocketbase' ? 'live port DB' : 'bundled schedule'}
              {data.weatherLive ? ' · weather: Open-Meteo' : ' · weather: seasonal model'}
              {data.lastUpdated
                ? ` · refreshed ${data.lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Anchorage' })}`
                : ''}
            </p>
          </div>
        </footer>
      </div>
    </GatewayContext.Provider>
  )
}
