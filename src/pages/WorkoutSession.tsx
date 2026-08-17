import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Minus, Plus } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { Button, Card, ProgressBar } from '../components/ui'
import { todayISO } from '../lib/date'
import type { LoggedExercise, LoggedSet, WorkoutLog } from '../types'

const FEELINGS = [
  { value: 1, emoji: '😩', label: 'Nehéz volt' },
  { value: 2, emoji: '😕', label: 'Fárasztó' },
  { value: 3, emoji: '🙂', label: 'Rendben' },
  { value: 4, emoji: '💪', label: 'Erős' },
  { value: 5, emoji: '🔥', label: 'Fantasztikus' },
] as const

function buildInitialExercises(planDay: NonNullable<ReturnType<typeof usePlanDay>>): LoggedExercise[] {
  return planDay.exercises.map((ex) => ({
    exerciseId: ex.exerciseId,
    name: ex.name,
    sets: Array.from({ length: ex.sets }).map((_, i) => ({
      setIndex: i,
      reps: null,
      weight: null,
      done: false,
    })),
  }))
}

function usePlanDay(dayId: string | undefined) {
  const { plan } = useAppData()
  return useMemo(() => plan?.days.find((d) => d.id === dayId) ?? null, [plan, dayId])
}

export default function WorkoutSession() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const { plan, logs, upsertLog } = useAppData()
  const planDay = usePlanDay(dayId)

  const today = todayISO()
  const existingLog = logs.find((l) => l.date === today && l.planDayId === dayId && !l.completed)

  const [logId] = useState(() => existingLog?.id ?? `log-${Date.now()}`)
  const [startedAt] = useState(() => existingLog?.startedAt ?? new Date().toISOString())
  const [exercises, setExercises] = useState<LoggedExercise[]>(() =>
    existingLog ? existingLog.exercises : planDay ? buildInitialExercises(planDay) : [],
  )
  const [showFinish, setShowFinish] = useState(false)
  const [feeling, setFeeling] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!plan) navigate('/', { replace: true })
  }, [plan, navigate])

  if (!plan || !planDay) return null

  const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0)
  const doneSets = exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.done).length, 0)

  const persist = (nextExercises: LoggedExercise[], completed = false) => {
    const log: WorkoutLog = {
      id: logId,
      date: today,
      planDayId: planDay.id,
      planDayTitle: planDay.title,
      exercises: nextExercises,
      completed,
      startedAt,
      completedAt: completed ? new Date().toISOString() : undefined,
      feeling: feeling ?? undefined,
      note: note || undefined,
    }
    upsertLog(log)
  }

  const updateSet = (exIndex: number, setIndex: number, patch: Partial<LoggedSet>) => {
    const next = exercises.map((ex, i) =>
      i === exIndex
        ? { ...ex, sets: ex.sets.map((s, si) => (si === setIndex ? { ...s, ...patch } : s)) }
        : ex,
    )
    setExercises(next)
    persist(next)
  }

  const toggleSetDone = (exIndex: number, setIndex: number) => {
    const set = exercises[exIndex].sets[setIndex]
    updateSet(exIndex, setIndex, { done: !set.done })
  }

  const finishWorkout = () => {
    persist(exercises, true)
    navigate('/', { replace: true })
  }

  return (
    <div className="px-5 pt-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">{planDay.title}</p>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Edzés folyamatban</h1>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-300">Haladás</span>
          <span className="text-slate-400">
            {doneSets} / {totalSets} szett
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={totalSets ? (doneSets / totalSets) * 100 : 0} />
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {planDay.exercises.map((planEx, exIndex) => {
          const logged = exercises[exIndex]
          if (!logged) return null
          return (
            <Card key={planEx.exerciseId} className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">{planEx.name}</h3>
                <span className="text-xs text-slate-400">
                  cél: {planEx.reps} · pihenő {planEx.restSec > 0 ? `${planEx.restSec}s` : '-'}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {logged.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 transition ${
                      set.done
                        ? 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-900/20'
                        : 'border-slate-100 dark:border-white/5'
                    }`}
                  >
                    <span className="w-14 shrink-0 text-xs font-medium text-slate-400">Szett {setIndex + 1}</span>
                    <NumberField
                      placeholder="ism."
                      value={set.reps}
                      onChange={(v) => updateSet(exIndex, setIndex, { reps: v })}
                    />
                    <NumberField
                      placeholder="kg"
                      value={set.weight}
                      onChange={(v) => updateSet(exIndex, setIndex, { weight: v })}
                    />
                    <button
                      onClick={() => toggleSetDone(exIndex, setIndex)}
                      className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                        set.done
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-300 dark:bg-white/10 dark:text-slate-500'
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-6">
        {!showFinish ? (
          <Button className="w-full py-3.5 text-base" onClick={() => setShowFinish(true)}>
            Edzés befejezése
          </Button>
        ) : (
          <Card className="p-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Milyen volt az edzés?</p>
            <div className="mt-3 flex justify-between">
              {FEELINGS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFeeling(f.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-2xl transition ${
                    feeling === f.value ? 'bg-violet-100 dark:bg-violet-900/30' : ''
                  }`}
                  title={f.label}
                >
                  {f.emoji}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Megjegyzés (opcionális)"
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              rows={2}
            />
            <Button className="mt-3 w-full py-3" onClick={finishWorkout}>
              Mentés és befejezés
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

function NumberField({
  value,
  onChange,
  placeholder,
}: {
  value: number | null
  onChange: (v: number | null) => void
  placeholder: string
}) {
  const step = () => onChange((value ?? 0) + 1)
  const unstep = () => onChange(Math.max(0, (value ?? 0) - 1))

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
      <button onClick={unstep} className="px-1.5 py-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5">
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-12 bg-transparent text-center text-sm outline-none dark:text-white"
      />
      <button onClick={step} className="px-1.5 py-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5">
        <Plus size={14} />
      </button>
    </div>
  )
}
