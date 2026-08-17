import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { Button, Card } from '../components/ui'
import { generatePlan } from '../lib/planGenerator'
import { getNotificationPermission, requestNotificationPermission } from '../lib/notifications'

const GOAL_LABELS: Record<string, string> = {
  fogyas: 'Fogyás',
  izomepites: 'Izomépítés',
  ero: 'Erőnövelés',
  allokepesseg: 'Állóképesség',
  altalanos: 'Általános fittség',
}

const LEVEL_LABELS: Record<string, string> = {
  kezdo: 'Kezdő',
  kozephalado: 'Középhaladó',
  halado: 'Haladó',
}

export default function Settings() {
  const { profile, setProfile, setPlan, resetAll } = useAppData()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const [permission, setPermission] = useState(getNotificationPermission())

  if (!profile) return null

  const updateProfile = (patch: Partial<typeof profile>) => {
    const next = { ...profile, ...patch }
    setProfile(next)
  }

  const regeneratePlan = () => {
    const newPlan = generatePlan(profile)
    setPlan(newPlan)
    navigate('/terv')
  }

  const handleReset = () => {
    resetAll()
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Beállítások</h1>

      <Card className="mt-5 p-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profil</p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Row label="Név" value={profile.name} />
          <Row label="Cél" value={GOAL_LABELS[profile.goal]} />
          <Row label="Szint" value={LEVEL_LABELS[profile.level]} />
          <Row label="Edzésnapok / hét" value={`${profile.trainingDays.length}`} />
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Emlékeztetők</p>
          <button
            onClick={() => updateProfile({ remindersEnabled: !profile.remindersEnabled })}
            className={`h-7 w-12 shrink-0 rounded-full transition ${profile.remindersEnabled ? 'bg-violet-600' : 'bg-slate-200 dark:bg-white/10'}`}
          >
            <div
              className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${profile.remindersEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
        {profile.remindersEnabled && (
          <div className="mt-3">
            <input
              type="time"
              value={profile.reminderTime}
              onChange={(e) => updateProfile({ reminderTime: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
            {permission !== 'granted' && permission !== 'unsupported' && (
              <Button
                variant="secondary"
                className="mt-2 w-full"
                onClick={async () => setPermission(await requestNotificationPermission())}
              >
                Böngésző-értesítés engedélyezése
              </Button>
            )}
          </div>
        )}
      </Card>

      <Card className="mt-4 flex flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Terv kezelése</p>
        <Button variant="secondary" onClick={regeneratePlan}>
          Terv frissítése (új gyakorlatválasztás)
        </Button>
        <Button variant="secondary" onClick={() => navigate('/onboarding')}>
          Kérdőív újra kitöltése
        </Button>
      </Card>

      <Card className="mt-4 flex flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-red-500">Veszélyzóna</p>
        {!confirmReset ? (
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            Összes adat törlése
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">
              Ez véglegesen törli a profilod, a terved és minden edzésnaplódat. Biztosan folytatod?
            </p>
            <div className="flex gap-2">
              <Button variant="danger" className="flex-1" onClick={handleReset}>
                Igen, törlés
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmReset(false)}>
                Mégse
              </Button>
            </div>
          </div>
        )}
      </Card>

      <p className="mt-6 pb-4 text-center text-xs text-slate-300 dark:text-slate-600">FitCoach · személyes edzéstárs</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  )
}
