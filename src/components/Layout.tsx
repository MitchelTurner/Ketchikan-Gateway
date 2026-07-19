import { NavLink, Outlet } from 'react-router-dom'
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
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-spruce-900 text-dawn-400 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                  <path
                    d="M3 16c4-7 7-10 12-10s8 3 12 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 18c3-4.5 6-6.5 9-6.5s6 2 9 6.5"
                    stroke="#7EB8B2"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block font-display text-[1.05rem] font-semibold leading-none text-spruce-900 group-hover:text-spruce-700">
                  Ketchikan Gateway
                </span>
                <span className="mt-0.5 block text-[0.7rem] font-medium tracking-wide text-fog-500 uppercase">
                  Passenger forecasts
                </span>
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
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-lg text-fog-50">Ketchikan Gateway</p>
              <p className="mt-1 max-w-md text-sm text-fog-300">
                Daily cruise passenger predictions for Ketchikan, cross-referenced with live
                weather. Install as an app for offline schedule access. Verify official times
                with the Port of Ketchikan.
              </p>
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
