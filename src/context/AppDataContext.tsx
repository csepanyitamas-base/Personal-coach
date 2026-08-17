import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Badge, BodyMetric, Plan, Profile, WorkoutLog } from '../types'
import { loadFromStorage, saveToStorage } from '../lib/storage'
import { evaluateNewBadges } from '../lib/badges'

interface AppDataContextValue {
  profile: Profile | null
  plan: Plan | null
  logs: WorkoutLog[]
  bodyMetrics: BodyMetric[]
  badges: Badge[]
  newlyUnlockedBadge: Badge | null
  clearNewlyUnlockedBadge: () => void
  setProfile: (p: Profile) => void
  setPlan: (p: Plan) => void
  upsertLog: (log: WorkoutLog) => void
  deleteLog: (logId: string) => void
  addBodyMetric: (metric: BodyMetric) => void
  resetAll: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(() => loadFromStorage('profile', null))
  const [plan, setPlanState] = useState<Plan | null>(() => loadFromStorage('plan', null))
  const [logs, setLogsState] = useState<WorkoutLog[]>(() => loadFromStorage('logs', []))
  const [bodyMetrics, setBodyMetricsState] = useState<BodyMetric[]>(() => loadFromStorage('bodyMetrics', []))
  const [badges, setBadgesState] = useState<Badge[]>(() => loadFromStorage('badges', []))
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null)

  const setProfile = (p: Profile) => {
    setProfileState(p)
    saveToStorage('profile', p)
  }

  const setPlan = (p: Plan) => {
    setPlanState(p)
    saveToStorage('plan', p)
  }

  const upsertLog = (log: WorkoutLog) => {
    setLogsState((prev) => {
      const next = [...prev.filter((l) => l.id !== log.id), log]
      saveToStorage('logs', next)

      const newBadges = evaluateNewBadges(next, badges)
      if (newBadges.length > 0) {
        const updatedBadges = [...badges, ...newBadges]
        setBadgesState(updatedBadges)
        saveToStorage('badges', updatedBadges)
        setNewlyUnlockedBadge(newBadges[0])
      }
      return next
    })
  }

  const deleteLog = (logId: string) => {
    setLogsState((prev) => {
      const next = prev.filter((l) => l.id !== logId)
      saveToStorage('logs', next)
      return next
    })
  }

  const addBodyMetric = (metric: BodyMetric) => {
    setBodyMetricsState((prev) => {
      const next = [...prev.filter((m) => m.date !== metric.date), metric].sort((a, b) =>
        a.date.localeCompare(b.date),
      )
      saveToStorage('bodyMetrics', next)
      return next
    })
  }

  const resetAll = () => {
    setProfileState(null)
    setPlanState(null)
    setLogsState([])
    setBodyMetricsState([])
    setBadgesState([])
    saveToStorage('profile', null)
    saveToStorage('plan', null)
    saveToStorage('logs', [])
    saveToStorage('bodyMetrics', [])
    saveToStorage('badges', [])
  }

  const value = useMemo(
    () => ({
      profile,
      plan,
      logs,
      bodyMetrics,
      badges,
      newlyUnlockedBadge,
      clearNewlyUnlockedBadge: () => setNewlyUnlockedBadge(null),
      setProfile,
      setPlan,
      upsertLog,
      deleteLog,
      addBodyMetric,
      resetAll,
    }),
    [profile, plan, logs, bodyMetrics, badges, newlyUnlockedBadge],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
