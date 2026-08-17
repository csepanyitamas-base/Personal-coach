import type { Profile, WorkoutLog } from '../types'
import { addDays, toISODate, WEEKDAY_LABELS_SHORT } from '../lib/date'

export default function WeekStrip({ profile, logs }: { profile: Profile; logs: WorkoutLog[] }) {
  const today = new Date()
  const startOfWeek = addDays(today, -today.getDay())
  const completedDates = new Set(logs.filter((l) => l.completed).map((l) => l.date))

  return (
    <div className="flex justify-between gap-1.5">
      {Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(startOfWeek, i)
        const iso = toISODate(day)
        const isTrainingDay = profile.trainingDays.includes(i)
        const isCompleted = completedDates.has(iso)
        const isToday = toISODate(today) === iso
        const isPast = day < today && !isToday
        const missed = isTrainingDay && isPast && !isCompleted

        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">{WEEKDAY_LABELS_SHORT[i]}</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition ${
                isCompleted
                  ? 'bg-violet-600 text-white'
                  : missed
                    ? 'bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400'
                    : isTrainingDay
                      ? 'border-2 border-violet-300 text-violet-600 dark:border-violet-700 dark:text-violet-300'
                      : 'bg-slate-100 text-slate-300 dark:bg-white/5 dark:text-slate-600'
              } ${isToday ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-[#f5f4fb] dark:ring-offset-[#0f1117]' : ''}`}
            >
              {isCompleted ? '✓' : day.getDate()}
            </div>
          </div>
        )
      })}
    </div>
  )
}
