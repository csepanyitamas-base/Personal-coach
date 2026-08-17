import type { Badge, WorkoutLog } from '../types'
import { calcCurrentStreak, calcLongestStreak, totalCompletedWorkouts } from './stats'

interface BadgeDef {
  id: string
  title: string
  description: string
  icon: string
  check: (logs: WorkoutLog[]) => boolean
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'first_workout',
    title: 'Első lépés',
    description: 'Teljesítetted az első edzésedet.',
    icon: '🎉',
    check: (logs) => totalCompletedWorkouts(logs) >= 1,
  },
  {
    id: 'five_workouts',
    title: 'Lendületben',
    description: '5 edzést teljesítettél.',
    icon: '💪',
    check: (logs) => totalCompletedWorkouts(logs) >= 5,
  },
  {
    id: 'twentyfive_workouts',
    title: 'Kitartó',
    description: '25 edzést teljesítettél.',
    icon: '🏆',
    check: (logs) => totalCompletedWorkouts(logs) >= 25,
  },
  {
    id: 'fifty_workouts',
    title: 'Veterán',
    description: '50 edzést teljesítettél.',
    icon: '🥇',
    check: (logs) => totalCompletedWorkouts(logs) >= 50,
  },
  {
    id: 'streak_3',
    title: '3 napos sorozat',
    description: '3 egymást követő napon edzettél.',
    icon: '🔥',
    check: (logs) => calcCurrentStreak(logs) >= 3 || calcLongestStreak(logs) >= 3,
  },
  {
    id: 'streak_7',
    title: 'Egyhetes sorozat',
    description: '7 egymást követő napon edzettél.',
    icon: '🔥',
    check: (logs) => calcCurrentStreak(logs) >= 7 || calcLongestStreak(logs) >= 7,
  },
  {
    id: 'streak_30',
    title: 'Havi bajnok',
    description: '30 egymást követő napon edzettél.',
    icon: '👑',
    check: (logs) => calcCurrentStreak(logs) >= 30 || calcLongestStreak(logs) >= 30,
  },
]

export function evaluateNewBadges(logs: WorkoutLog[], existing: Badge[]): Badge[] {
  const existingIds = new Set(existing.map((b) => b.id))
  const newlyUnlocked: Badge[] = []
  for (const def of BADGE_DEFS) {
    if (!existingIds.has(def.id) && def.check(logs)) {
      newlyUnlocked.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlockedAt: new Date().toISOString(),
      })
    }
  }
  return newlyUnlocked
}

export function allBadgeDefs() {
  return BADGE_DEFS
}
