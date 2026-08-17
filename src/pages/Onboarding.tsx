import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Dumbbell } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { Button, Card, Pill } from '../components/ui'
import { generatePlan } from '../lib/planGenerator'
import { requestNotificationPermission } from '../lib/notifications'
import { WEEKDAY_LABELS_LONG } from '../lib/date'
import type { Equipment, FocusArea, Goal, JointLimitation, Level, Profile } from '../types'

const GOAL_OPTIONS: { value: Goal; label: string; desc: string }[] = [
  { value: 'fogyas', label: 'Fogyás', desc: 'Zsírégetés, kalóriadeficit támogatása' },
  { value: 'izomepites', label: 'Izomépítés', desc: 'Izomtömeg és forma növelése' },
  { value: 'ero', label: 'Erőnövelés', desc: 'Minél nagyobb súlyok, kevesebb ismétlés' },
  { value: 'allokepesseg', label: 'Állóképesség', desc: 'Kitartás, kondíció fejlesztése' },
  { value: 'altalanos', label: 'Általános fittség', desc: 'Kiegyensúlyozott, egészséges edzés' },
]

const LEVEL_OPTIONS: { value: Level; label: string; desc: string }[] = [
  { value: 'kezdo', label: 'Kezdő', desc: 'Most kezdek, vagy régóta szüneteltem' },
  { value: 'kozephalado', label: 'Középhaladó', desc: 'Rendszeresen edzek pár hónapja/éve' },
  { value: 'halado', label: 'Haladó', desc: 'Tapasztalt vagyok, komplex gyakorlatokkal is elboldogulok' },
]

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'dumbbell', label: 'Súlyzók' },
  { value: 'barbell', label: 'Rúd (barbell)' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'band', label: 'Húzógumi' },
  { value: 'machine', label: 'Edzőtermi gépek' },
  { value: 'cardio_machine', label: 'Futópad / bicikli / evezőgép' },
]

const FOCUS_OPTIONS: { value: FocusArea; label: string }[] = [
  { value: 'has', label: 'Has / core' },
  { value: 'lab_fenek', label: 'Láb és fenék' },
  { value: 'kar', label: 'Kar' },
  { value: 'hat', label: 'Hát' },
  { value: 'mell', label: 'Mell' },
  { value: 'vall', label: 'Váll' },
  { value: 'teljes_test', label: 'Teljes test' },
]

const LIMITATION_OPTIONS: { value: JointLimitation; label: string }[] = [
  { value: 'terd', label: 'Térd' },
  { value: 'vall', label: 'Váll' },
  { value: 'derek', label: 'Derék' },
  { value: 'csuklo', label: 'Csukló' },
]

const STEPS = ['üdvözlés', 'cél', 'szint', 'napok', 'eszközök', 'fókusz', 'korlátok', 'emlékeztető', 'összegzés'] as const

export default function Onboarding() {
  const navigate = useNavigate()
  const { setProfile, setPlan } = useAppData()
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [goal, setGoal] = useState<Goal | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [trainingDays, setTrainingDays] = useState<number[]>([1, 3, 5])
  const [equipment, setEquipment] = useState<Equipment[]>(['bodyweight' as Equipment])
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([])
  const [limitations, setLimitations] = useState<JointLimitation[]>([])
  const [reminderTime, setReminderTime] = useState('18:00')
  const [remindersEnabled, setRemindersEnabled] = useState(true)

  const toggle = <T,>(arr: T[], value: T, setter: (v: T[]) => void) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
  }

  const canGoNext = (): boolean => {
    switch (STEPS[step]) {
      case 'cél':
        return goal !== null
      case 'szint':
        return level !== null
      case 'napok':
        return trainingDays.length >= 1
      default:
        return true
    }
  }

  const goNext = async () => {
    if (STEPS[step] === 'emlékeztető' && remindersEnabled) {
      await requestNotificationPermission()
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  const finish = () => {
    if (!goal || !level) return
    const equipmentFinal = equipment.includes('bodyweight') ? equipment : [...equipment, 'bodyweight' as Equipment]
    const profile: Profile = {
      name: name.trim() || 'Bajnok',
      goal,
      level,
      equipment: equipmentFinal,
      focusAreas,
      limitations,
      trainingDays: [...trainingDays].sort((a, b) => a - b),
      reminderTime,
      remindersEnabled,
      createdAt: new Date().toISOString(),
    }
    const plan = generatePlan(profile)
    setProfile(profile)
    setPlan(plan)
    navigate('/')
  }

  const progressPct = ((step + 1) / STEPS.length) * 100

  return (
    <div className="flex min-h-screen flex-col px-5 pb-8 pt-6">
      <div className="mb-6 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        {STEPS[step] === 'üdvözlés' && (
          <div className="flex flex-col items-center pt-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
              <Dumbbell size={30} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Szia! Én vagyok a FitCoach</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Néhány kérdéssel összeállítom a személyre szabott edzéstervedet, emlékeztetlek az edzésnapokon, és
              követem a fejlődésedet.
            </p>
            <div className="mt-8 w-full text-left">
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Mi a neved? (opcionális)
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="pl. Anna"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {STEPS[step] === 'cél' && (
          <StepWrapper title="Mi a fő célod?" subtitle="Ez alapján állítom össze a szetteket és ismétléseket.">
            <div className="flex flex-col gap-3">
              {GOAL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  active={goal === opt.value}
                  onClick={() => setGoal(opt.value)}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {STEPS[step] === 'szint' && (
          <StepWrapper title="Milyen szinten vagy jelenleg?">
            <div className="flex flex-col gap-3">
              {LEVEL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  active={level === opt.value}
                  onClick={() => setLevel(opt.value)}
                />
              ))}
            </div>
          </StepWrapper>
        )}

        {STEPS[step] === 'napok' && (
          <StepWrapper title="Mely napokon tudsz edzeni?" subtitle="Válaszd ki azokat a napokat, amikor biztosan van időd.">
            <div className="grid grid-cols-2 gap-2.5">
              {WEEKDAY_LABELS_LONG.map((label, idx) => (
                <Pill key={idx} active={trainingDays.includes(idx)} onClick={() => toggle(trainingDays, idx, setTrainingDays)}>
                  {label}
                </Pill>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-400">Kiválasztva: {trainingDays.length} nap / hét</p>
          </StepWrapper>
        )}

        {STEPS[step] === 'eszközök' && (
          <StepWrapper title="Milyen eszközök állnak rendelkezésre?" subtitle="Testsúlyos gyakorlatok mindig szerepelnek.">
            <div className="flex flex-wrap gap-2.5">
              {EQUIPMENT_OPTIONS.map((opt) => (
                <Pill key={opt.value} active={equipment.includes(opt.value)} onClick={() => toggle(equipment, opt.value, setEquipment)}>
                  {opt.label}
                </Pill>
              ))}
            </div>
          </StepWrapper>
        )}

        {STEPS[step] === 'fókusz' && (
          <StepWrapper title="Van kiemelt fókuszterületed?" subtitle="Opcionális – ha nem választasz, kiegyensúlyozott tervet kapsz.">
            <div className="flex flex-wrap gap-2.5">
              {FOCUS_OPTIONS.map((opt) => (
                <Pill key={opt.value} active={focusAreas.includes(opt.value)} onClick={() => toggle(focusAreas, opt.value, setFocusAreas)}>
                  {opt.label}
                </Pill>
              ))}
            </div>
          </StepWrapper>
        )}

        {STEPS[step] === 'korlátok' && (
          <StepWrapper title="Van sérülésed vagy panaszod?" subtitle="Ezeket a terheléseket elkerüljük a gyakorlatoknál.">
            <div className="flex flex-wrap gap-2.5">
              {LIMITATION_OPTIONS.map((opt) => (
                <Pill key={opt.value} active={limitations.includes(opt.value)} onClick={() => toggle(limitations, opt.value, setLimitations)}>
                  {opt.label}
                </Pill>
              ))}
            </div>
          </StepWrapper>
        )}

        {STEPS[step] === 'emlékeztető' && (
          <StepWrapper title="Emlékeztetlek az edzésnapokon?" subtitle="Értesítést küldök, ha eljön az edzés ideje.">
            <Card className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Emlékeztetők engedélyezése</p>
                <p className="text-sm text-slate-400">Böngésző-értesítés edzésnapokon</p>
              </div>
              <button
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                className={`h-7 w-12 shrink-0 rounded-full transition ${remindersEnabled ? 'bg-violet-600' : 'bg-slate-200 dark:bg-white/10'}`}
              >
                <div
                  className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${remindersEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            </Card>
            {remindersEnabled && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Emlékeztető időpontja</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                />
              </div>
            )}
          </StepWrapper>
        )}

        {STEPS[step] === 'összegzés' && goal && level && (
          <StepWrapper title="Készen állsz!" subtitle="Ez alapján generálom a terved:">
            <Card className="flex flex-col gap-3 p-4 text-sm">
              <SummaryRow label="Cél" value={GOAL_OPTIONS.find((g) => g.value === goal)?.label ?? ''} />
              <SummaryRow label="Szint" value={LEVEL_OPTIONS.find((l) => l.value === level)?.label ?? ''} />
              <SummaryRow label="Edzésnapok" value={`${trainingDays.length} nap / hét`} />
              <SummaryRow label="Eszközök" value={equipment.length > 1 ? `${equipment.length} típus` : 'Testsúlyos'} />
              <SummaryRow label="Emlékeztető" value={remindersEnabled ? `${reminderTime}-kor` : 'Kikapcsolva'} />
            </Card>
          </StepWrapper>
        )}
      </div>

      <div className="mt-8">
        {STEPS[step] === 'összegzés' ? (
          <Button className="w-full py-3.5 text-base" onClick={finish}>
            Edzésterv elkészítése
          </Button>
        ) : (
          <Button className="w-full py-3.5 text-base" disabled={!canGoNext()} onClick={goNext}>
            Tovább
          </Button>
        )}
      </div>
    </div>
  )
}

function StepWrapper({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function OptionCard({
  label,
  desc,
  active,
  onClick,
}: {
  label: string
  desc: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
          : 'border-slate-200 bg-white hover:border-violet-200 dark:border-white/10 dark:bg-slate-900'
      }`}
    >
      <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </button>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 last:border-0 last:pb-0 dark:border-white/5">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-800 dark:text-white">{value}</span>
    </div>
  )
}
