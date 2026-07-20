import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { ApiPage } from './pages/ApiPage'
import { BerthsPage } from './pages/BerthsPage'
import { DataSourcesPage } from './pages/DataSourcesPage'
import { GuidePage } from './pages/guides/GuidePage'
import { GuidesIndexPage } from './pages/guides/GuidesIndexPage'
import { InsightsPage } from './pages/InsightsPage'
import { ManagePage } from './pages/ManagePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ScheduleHubPage } from './pages/schedule/ScheduleHubPage'
import { ScheduleMonthPage } from './pages/schedule/ScheduleMonthPage'
import { ScheduleParamPage } from './pages/schedule/ScheduleParamPage'
import { ShipDetailPage } from './pages/ships/ShipDetailPage'
import { ShipsIndexPage } from './pages/ships/ShipsIndexPage'
import { StatsPage } from './pages/StatsPage'
import { TodayPage } from './pages/TodayPage'

function LegacyDayRedirect() {
  const { date = '' } = useParams()
  if (date === 'today') return <Navigate to="/" replace />
  if (date === 'tomorrow') return <Navigate to="/schedule/tomorrow" replace />
  return <Navigate to={`/schedule/${date}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<TodayPage />} />
          <Route path="today" element={<Navigate to="/" replace />} />

          <Route path="schedule" element={<ScheduleHubPage />} />
          <Route path="schedule/:year/:month" element={<ScheduleMonthPage />} />
          <Route path="schedule/:date" element={<ScheduleParamPage />} />

          <Route path="ships" element={<ShipsIndexPage />} />
          <Route path="ships/:slug" element={<ShipDetailPage />} />

          <Route path="stats" element={<StatsPage />} />
          <Route path="stats/:year" element={<StatsPage />} />

          <Route path="berths" element={<BerthsPage />} />
          <Route path="guides" element={<GuidesIndexPage />} />
          <Route path="guides/:slug" element={<GuidePage />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="data-sources" element={<DataSourcesPage />} />
          <Route path="api" element={<ApiPage />} />

          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="manage" element={<ManagePage />} />

          <Route path="calendar" element={<Navigate to="/schedule" replace />} />
          <Route path="day/:date" element={<LegacyDayRedirect />} />

          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
