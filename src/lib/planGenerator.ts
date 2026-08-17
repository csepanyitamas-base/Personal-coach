import { EXERCISES } from './exercises'
import type { Equipment, Exercise, Goal, Level, MuscleGroup, Plan, PlanExercise, Profile, WorkoutDayPlan } from '../types'

interface GoalParams {
  sets: number
  reps: string
  restSec: number
  cardioFinisher: boolean
}

const GOAL_PARAMS: Record<Goal, GoalParams> = {
  fogyas: { sets: 3, reps: '12-15', restSec: 35, cardioFinisher: true },
  izomepites: { sets: 4, reps: '8-12', restSec: 75, cardioFinisher: false },
  ero: { sets: 5, reps: '4-6', restSec: 150, cardioFinisher: false },
  allokepesseg: { sets: 3, reps: '15-20', restSec: 30, cardioFinisher: true },
  altalanos: { sets: 3, reps: '10-12', restSec: 60, cardioFinisher: true },
}

const LEVEL_SET_MODIFIER: Record<Level, number> = {
  kezdo: -1,
  kozephalado: 0,
  halado: 1,
}

type SplitDay = { title: string; groups: MuscleGroup[] }

// Split választás napok száma szerint
function chooseSplit(daysPerWeek: number, level: Level): SplitDay[] {
  if (daysPerWeek <= 1) {
    return [{ title: 'Teljes test', groups: ['teljes_test', 'mell', 'hat', 'lab', 'has'] }]
  }
  if (daysPerWeek === 2) {
    return [
      { title: 'Teljes test A', groups: ['lab', 'mell', 'hat', 'has'] },
      { title: 'Teljes test B', groups: ['fenek', 'vall', 'bicepsz', 'tricepsz', 'has'] },
    ]
  }
  if (daysPerWeek === 3) {
    if (level === 'kezdo') {
      return [
        { title: 'Teljes test A', groups: ['lab', 'mell', 'hat', 'has'] },
        { title: 'Teljes test B', groups: ['fenek', 'vall', 'bicepsz', 'tricepsz'] },
        { title: 'Teljes test C', groups: ['lab', 'hat', 'mell', 'has', 'cardio'] },
      ]
    }
    return [
      { title: 'Húzó (hát, bicepsz)', groups: ['hat', 'bicepsz', 'has'] },
      { title: 'Toló (mell, váll, tricepsz)', groups: ['mell', 'vall', 'tricepsz'] },
      { title: 'Láb és fenék', groups: ['lab', 'fenek', 'has'] },
    ]
  }
  if (daysPerWeek === 4) {
    return [
      { title: 'Felsőtest A (mell, tricepsz)', groups: ['mell', 'tricepsz', 'vall'] },
      { title: 'Alsótest A (láb, fenék)', groups: ['lab', 'fenek', 'has'] },
      { title: 'Felsőtest B (hát, bicepsz)', groups: ['hat', 'bicepsz', 'vall'] },
      { title: 'Alsótest B + kardió', groups: ['lab', 'fenek', 'cardio', 'has'] },
    ]
  }
  if (daysPerWeek === 5) {
    return [
      { title: 'Mell és tricepsz', groups: ['mell', 'tricepsz'] },
      { title: 'Hát és bicepsz', groups: ['hat', 'bicepsz'] },
      { title: 'Láb', groups: ['lab', 'fenek'] },
      { title: 'Váll és has', groups: ['vall', 'has'] },
      { title: 'Kardió és teljes test', groups: ['cardio', 'teljes_test', 'has'] },
    ]
  }
  // 6+ nap: Push/Pull/Legs x2
  return [
    { title: 'Toló A (mell, váll, tricepsz)', groups: ['mell', 'vall', 'tricepsz'] },
    { title: 'Húzó A (hát, bicepsz)', groups: ['hat', 'bicepsz'] },
    { title: 'Láb A', groups: ['lab', 'fenek', 'has'] },
    { title: 'Toló B (mell, váll, tricepsz)', groups: ['mell', 'vall', 'tricepsz'] },
    { title: 'Húzó B (hát, bicepsz)', groups: ['hat', 'bicepsz'] },
    { title: 'Láb B + kardió', groups: ['lab', 'fenek', 'cardio', 'has'] },
  ]
}

function filterExercisesFor(
  group: MuscleGroup,
  profile: Profile,
): Exercise[] {
  const equipmentSet = new Set<Equipment>([...profile.equipment, 'bodyweight'])
  return EXERCISES.filter(
    (ex) =>
      ex.muscleGroup === group &&
      equipmentSet.has(ex.equipment) &&
      ex.level.includes(profile.level) &&
      !ex.jointStress.some((j) => profile.limitations.includes(j)),
  )
}

function pickExercises(group: MuscleGroup, profile: Profile, count: number, used: Set<string>): Exercise[] {
  let pool = filterExercisesFor(group, profile).filter((e) => !used.has(e.id))
  if (pool.length < count) {
    // engedjük az ismétlést, ha kevés a lehetőség
    pool = filterExercisesFor(group, profile)
  }
  // preferáljuk a nem-bodyweight eszközöket, ha van felszerelés, változatosság kedvéért
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const picked = shuffled.slice(0, count)
  picked.forEach((p) => used.add(p.id))
  return picked
}

function exercisesPerGroup(groups: MuscleGroup[]): number {
  // minél kevesebb az izomcsoport egy napon, annál több gyakorlat jusson rá
  if (groups.length <= 2) return 3
  if (groups.length <= 4) return 2
  return 1
}

export function generatePlan(profile: Profile): Plan {
  const splitDays = chooseSplit(profile.trainingDays.length, profile.level)
  const goalParams = GOAL_PARAMS[profile.goal]
  const setModifier = LEVEL_SET_MODIFIER[profile.level]

  const sortedTrainingDays = [...profile.trainingDays].sort((a, b) => a - b)

  const days: WorkoutDayPlan[] = sortedTrainingDays.map((dayOfWeek, i) => {
    const splitDay = splitDays[i % splitDays.length]
    const used = new Set<string>()
    const perGroup = exercisesPerGroup(splitDay.groups)

    const planExercises: PlanExercise[] = []
    for (const group of splitDay.groups) {
      const chosen = pickExercises(group, profile, group === 'cardio' ? 1 : perGroup, used)
      for (const ex of chosen) {
        const isCardio = ex.muscleGroup === 'cardio'
        planExercises.push({
          exerciseId: ex.id,
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          sets: isCardio ? 1 : Math.max(2, goalParams.sets + setModifier),
          reps: isCardio ? '8-12 perc' : goalParams.reps,
          restSec: isCardio ? 0 : goalParams.restSec,
        })
      }
    }

    if (goalParams.cardioFinisher && !splitDay.groups.includes('cardio')) {
      const cardioEx = pickExercises('cardio', profile, 1, used)[0]
      if (cardioEx) {
        planExercises.push({
          exerciseId: cardioEx.id,
          name: cardioEx.name,
          muscleGroup: 'cardio',
          sets: 1,
          reps: '5-8 perc',
          restSec: 0,
        })
      }
    }

    return {
      id: `day-${dayOfWeek}`,
      dayOfWeek,
      title: splitDay.title,
      exercises: planExercises,
    }
  })

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    goal: profile.goal,
    level: profile.level,
    splitName: splitDays.length === 1 ? 'Teljes test' : `${splitDays.length} napos felosztás`,
    days,
  }
}
