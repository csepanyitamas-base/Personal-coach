export type Goal = 'fogyas' | 'izomepites' | 'ero' | 'allokepesseg' | 'altalanos'

export type Level = 'kezdo' | 'kozephalado' | 'halado'

export type Equipment =
  | 'bodyweight'
  | 'dumbbell'
  | 'barbell'
  | 'kettlebell'
  | 'band'
  | 'machine'
  | 'cardio_machine'

export type FocusArea = 'has' | 'lab_fenek' | 'kar' | 'hat' | 'mell' | 'vall' | 'teljes_test'

export type JointLimitation = 'terd' | 'vall' | 'derek' | 'csuklo'

export type MuscleGroup =
  | 'mell'
  | 'hat'
  | 'lab'
  | 'fenek'
  | 'vall'
  | 'bicepsz'
  | 'tricepsz'
  | 'has'
  | 'cardio'
  | 'teljes_test'

export interface Profile {
  name: string
  goal: Goal
  level: Level
  equipment: Equipment[]
  focusAreas: FocusArea[]
  limitations: JointLimitation[]
  trainingDays: number[] // 0=vasárnap ... 6=szombat
  reminderTime: string // "HH:mm"
  remindersEnabled: boolean
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  level: Level[]
  jointStress: JointLimitation[]
  cue?: string
}

export interface PlanExercise {
  exerciseId: string
  name: string
  muscleGroup: MuscleGroup
  sets: number
  reps: string
  restSec: number
}

export interface WorkoutDayPlan {
  id: string
  dayOfWeek: number // 0-6
  title: string
  exercises: PlanExercise[]
}

export interface Plan {
  id: string
  createdAt: string
  goal: Goal
  level: Level
  splitName: string
  days: WorkoutDayPlan[]
}

export interface LoggedSet {
  setIndex: number
  reps: number | null
  weight: number | null
  done: boolean
}

export interface LoggedExercise {
  exerciseId: string
  name: string
  sets: LoggedSet[]
}

export interface WorkoutLog {
  id: string
  date: string // ISO yyyy-MM-dd
  planDayId: string
  planDayTitle: string
  exercises: LoggedExercise[]
  completed: boolean
  startedAt: string
  completedAt?: string
  feeling?: 1 | 2 | 3 | 4 | 5
  note?: string
}

export interface BodyMetric {
  date: string // ISO yyyy-MM-dd
  weightKg?: number
  note?: string
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
}

export interface AppData {
  profile: Profile | null
  plan: Plan | null
  logs: WorkoutLog[]
  bodyMetrics: BodyMetric[]
  badges: Badge[]
}
