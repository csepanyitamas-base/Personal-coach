import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle2, Flame, PartyPopper, Sparkles } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { Button, Card, StatCard } from '../components/ui'
import WeekStrip from '../components/WeekStrip'
import { getDailyQuote, getStreakMessage } from '../lib/motivation'
import { calcCurrentStreak, totalCompletedWorkouts, workoutsInLastNDays } from '../lib/stats'
import { todayISO } from '../lib/date'
import { getNotificationPermission, requestNotificationPermission } from '../lib/notifications'
import { useReminder } from '../lib/useReminder'

export default function Dashboard() {
  const { profile, plan, logs, newlyUnlockedBadge, clearNewlyUnlockedBadge } = useAppData()
  const navigate = useNavigate()
  const [permission, setPermission] = useState(getNotificationPermission())

  useReminder(profile, plan, logs)

  useEffect(() => {
    if (!profile) navigate('/onboarding', { replace: true })
  }, [profile, navigate])

  if (!profile || !plan) return null

  const today = new Date()
  const todayDow = today.getDay()
  const isTrainingDay = profile.trainingDays.includes(todayDow)
  const todayPlan = plan.days.find((d) => d.dayOfWeek === todayDow)
  const todayLog = logs.find((l) => l.date === todayISO() && l.completed)

  const streak = calcCurrentStreak(logs)
  const streakMsg = getStreakMessage(streak)
  const total = totalCompletedWorkouts(logs)
  const last7 = workoutsInLastNDays(logs, 7)

  const firstName = profile.name

  return (
    <div className="px-5 pt-6">
      {newlyUnlockedBadge && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
          <PartyPopper className="mt-0.5 shrink-0 text-amber-500" size={22} />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Új jelvény: {newlyUnlockedBadge.icon} {newlyUnlockedBadge.title}
            </p>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80">{newlyUnlockedBadge.description}</p>
          </div>
          <button onClick={clearNewlyUnlockedBadge} className="text-amber-400 hover:text-amber-600">
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {today.toLocaleDateString('hu-HU', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Szia, {firstName}!</h1>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <Flame size={16} /> {streak}
          </div>
        )}
      </div>

      {profile.remindersEnabled && permission !== 'granted' && permission !== 'unsupported' && (
        <Card className="mt-4 flex items-center gap-3 p-4">
          <Bell className="shrink-0 text-violet-500" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-white">Kapcsold be az emlékeztetőket</p>
            <p className="text-xs text-slate-400">Ne maradj le egy edzésnapról sem</p>
          </div>
          <Button
            variant="secondary"
            className="shrink-0 px-3 py-2 text-xs"
            onClick={async () => setPermission(await requestNotificationPermission())}
          >
            Engedélyezés
          </Button>
        </Card>
      )}

      <Card className="mt-4 p-5">
        {todayLog ? (
          <div className="flex flex-col items-center py-2 text-center">
            <CheckCircle2 className="mb-2 text-emerald-500" size={36} />
            <p className="font-semibold text-slate-800 dark:text-white">Mai edzés teljesítve!</p>
            <p className="mt-1 text-sm text-slate-400">Szép munka, pihend ki magad.</p>
          </div>
        ) : isTrainingDay && todayPlan ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Mai edzés</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{todayPlan.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{todayPlan.exercises.length} gyakorlat</p>
            <Button className="mt-4 w-full py-3" onClick={() => navigate(`/edzes/${todayPlan.id}`)}>
              Edzés indítása
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 text-center">
            <Sparkles className="mb-2 text-violet-400" size={30} />
            <p className="font-semibold text-slate-800 dark:text-white">Ma pihenőnap van</p>
            <p className="mt-1 text-sm text-slate-400">Regenerálódj, a következő edzésnap hamarosan jön.</p>
          </div>
        )}
      </Card>

      <div className="mt-5">
        <WeekStrip profile={profile} logs={logs} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard label="Sorozat" value={`${streak} nap`} />
        <StatCard label="Összesen" value={`${total}`} sub="edzés" />
        <StatCard label="7 napban" value={`${last7}`} sub="edzés" />
      </div>

      {streakMsg && (
        <Card className="mt-4 flex items-center gap-3 p-4">
          <Flame className="shrink-0 text-orange-500" size={20} />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{streakMsg}</p>
        </Card>
      )}

      <Card className="mt-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-100">Napi motiváció</p>
        <p className="mt-2 text-base font-medium leading-snug">„{getDailyQuote()}”</p>
      </Card>
    </div>
  )
}
