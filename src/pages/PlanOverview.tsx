import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { Card, Button } from '../components/ui'
import { WEEKDAY_LABELS_LONG, todayISO } from '../lib/date'

const GOAL_LABELS: Record<string, string> = {
  fogyas: 'Fogyás',
  izomepites: 'Izomépítés',
  ero: 'Erőnövelés',
  allokepesseg: 'Állóképesség',
  altalanos: 'Általános fittség',
}

export default function PlanOverview() {
  const { profile, plan, logs } = useAppData()
  const navigate = useNavigate()

  if (!profile || !plan) return null

  const today = todayISO()
  const todayDow = new Date().getDay()

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">A terved</h1>
      <p className="mt-1 text-sm text-slate-400">
        {plan.splitName} · Cél: {GOAL_LABELS[plan.goal]}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {plan.days.map((day) => {
          const doneToday = logs.some((l) => l.date === today && l.planDayId === day.id && l.completed)
          const isToday = day.dayOfWeek === todayDow

          return (
            <Card key={day.id} className={`p-4 ${isToday ? 'border-violet-400 ring-1 ring-violet-200 dark:ring-violet-900' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                    {WEEKDAY_LABELS_LONG[day.dayOfWeek]}
                    {isToday && ' · ma'}
                  </p>
                  <h3 className="mt-0.5 font-bold text-slate-900 dark:text-white">{day.title}</h3>
                </div>
                {doneToday && <span className="text-xl">✅</span>}
              </div>

              <ul className="mt-3 flex flex-col gap-1.5">
                {day.exercises.map((ex) => (
                  <li key={ex.exerciseId} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{ex.name}</span>
                    <span className="text-slate-400">
                      {ex.sets} × {ex.reps}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isToday ? 'primary' : 'secondary'}
                className="mt-4 w-full py-2.5"
                onClick={() => navigate(`/edzes/${day.id}`)}
              >
                {doneToday ? 'Újra elvégzem' : 'Edzés indítása'}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
