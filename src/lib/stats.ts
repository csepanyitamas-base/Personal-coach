import type { WorkoutLog } from '../types'
import { addDays, toISODate } from './date'

export function calcCurrentStreak(logs: WorkoutLog[]): number {
  const completedDates = new Set(logs.filter((l) => l.completed).map((l) => l.date))
  if (completedDates.size === 0) return 0

  let streak = 0
  let cursor = new Date()

  // ha ma még nincs edzés, kezdjük a tegnapi nappal, hogy a mai nap ne törje meg a sorozatot
  if (!completedDates.has(toISODate(cursor))) {
    cursor = addDays(cursor, -1)
  }

  while (completedDates.has(toISODate(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}

export function calcLongestStreak(logs: WorkoutLog[]): number {
  const completedDates = [...new Set(logs.filter((l) => l.completed).map((l) => l.date))].sort()
  if (completedDates.length === 0) return 0

  let longest = 1
  let current = 1
  for (let i = 1; i < completedDates.length; i++) {
    const prev = new Date(completedDates[i - 1] + 'T00:00:00')
    const curr = new Date(completedDates[i] + 'T00:00:00')
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      current += 1
    } else {
      current = 1
    }
    longest = Math.max(longest, current)
  }
  return longest
}

export function totalCompletedWorkouts(logs: WorkoutLog[]): number {
  return logs.filter((l) => l.completed).length
}

export function totalVolumeKg(log: WorkoutLog): number {
  let total = 0
  for (const ex of log.exercises) {
    for (const s of ex.sets) {
      if (s.done && s.weight && s.reps) {
        total += s.weight * s.reps
      }
    }
  }
  return total
}

export function workoutsInLastNDays(logs: WorkoutLog[], n: number): number {
  const cutoff = addDays(new Date(), -n)
  return logs.filter((l) => l.completed && new Date(l.date + 'T00:00:00') >= cutoff).length
}

export interface WeeklyPoint {
  weekLabel: string
  count: number
  volume: number
}

export function weeklyAggregates(logs: WorkoutLog[], weeks = 8): WeeklyPoint[] {
  const completed = logs.filter((l) => l.completed)
  const now = new Date()
  const points: WeeklyPoint[] = []

  for (let w = weeks - 1; w >= 0; w--) {
    const weekEnd = addDays(now, -7 * w)
    const weekStart = addDays(weekEnd, -6)
    const inRange = completed.filter((l) => {
      const d = new Date(l.date + 'T00:00:00')
      return d >= weekStart && d <= weekEnd
    })
    points.push({
      weekLabel: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      count: inRange.length,
      volume: inRange.reduce((sum, l) => sum + totalVolumeKg(l), 0),
    })
  }
  return points
}
