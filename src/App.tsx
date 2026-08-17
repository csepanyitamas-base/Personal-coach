import type { ReactNode } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppDataProvider, useAppData } from './context/AppDataContext'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import PlanOverview from './pages/PlanOverview'
import WorkoutSession from './pages/WorkoutSession'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function RequireProfile({ children }: { children: ReactNode }) {
  const { profile } = useAppData()
  if (!profile) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        element={
          <RequireProfile>
            <Layout />
          </RequireProfile>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/terv" element={<PlanOverview />} />
        <Route path="/edzes/:dayId" element={<WorkoutSession />} />
        <Route path="/elorehaladas" element={<Progress />} />
        <Route path="/beallitasok" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppDataProvider>
  )
}
