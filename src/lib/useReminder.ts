import { useEffect, useRef } from 'react'
import type { Plan, Profile, WorkoutLog } from '../types'
import { fireNotification } from './notifications'
import { todayISO } from './date'

export function useReminder(profile: Profile | null, plan: Plan | null, logs: WorkoutLog[]) {
  const firedTodayRef = useRef<string | null>(null)

  useEffect(() => {
    if (!profile || !plan || !profile.remindersEnabled) return

    const check = () => {
      const now = new Date()
      const today = todayISO()
      const isTrainingDay = profile.trainingDays.includes(now.getDay())
      if (!isTrainingDay) return

      const alreadyCompleted = logs.some((l) => l.date === today && l.completed)
      if (alreadyCompleted) return

      const [hh, mm] = profile.reminderTime.split(':').map(Number)
      const reminderMinutes = hh * 60 + mm
      const nowMinutes = now.getHours() * 60 + now.getMinutes()

      if (nowMinutes >= reminderMinutes && firedTodayRef.current !== today) {
        const dayPlan = plan.days.find((d) => d.dayOfWeek === now.getDay())
        fireNotification(
          'Edzés ideje! 💪',
          dayPlan ? `Ma "${dayPlan.title}" van a tervben. Gyerünk!` : 'Ne feledkezz meg a mai edzésről!',
        )
        firedTodayRef.current = today
      }
    }

    check()
    const interval = setInterval(check, 60 * 1000)
    return () => clearInterval(interval)
  }, [profile, plan, logs])
}
