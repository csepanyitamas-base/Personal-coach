import type { Exercise } from '../types'

// Szint rövidítések: kezdo, kozephalado, halado
const ALL_LEVELS: Exercise['level'] = ['kezdo', 'kozephalado', 'halado']
const INTER_ADV: Exercise['level'] = ['kozephalado', 'halado']

export const EXERCISES: Exercise[] = [
  // MELL
  { id: 'pushup', name: 'Fekvőtámasz', muscleGroup: 'mell', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['csuklo', 'vall'] },
  { id: 'incline_pushup', name: 'Lejtős fekvőtámasz (kézre)', muscleGroup: 'mell', equipment: 'bodyweight', level: ['kezdo', 'kozephalado'], jointStress: ['csuklo'] },
  { id: 'db_bench_press', name: 'Súlyzós fekvenyomás', muscleGroup: 'mell', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['vall'] },
  { id: 'db_incline_press', name: 'Súlyzós ferde fekvenyomás', muscleGroup: 'mell', equipment: 'dumbbell', level: INTER_ADV, jointStress: ['vall'] },
  { id: 'db_fly', name: 'Súlyzós mellhúzás (fly)', muscleGroup: 'mell', equipment: 'dumbbell', level: INTER_ADV, jointStress: ['vall'] },
  { id: 'barbell_bench_press', name: 'Rúddal fekvenyomás', muscleGroup: 'mell', equipment: 'barbell', level: INTER_ADV, jointStress: ['vall', 'csuklo'] },
  { id: 'chest_press_machine', name: 'Mellnyomó gép', muscleGroup: 'mell', equipment: 'machine', level: ALL_LEVELS, jointStress: [] },
  { id: 'cable_crossover', name: 'Kábeles keresztezés', muscleGroup: 'mell', equipment: 'machine', level: INTER_ADV, jointStress: ['vall'] },

  // HÁT
  { id: 'superman', name: 'Superman hátfeszítés', muscleGroup: 'hat', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['derek'] },
  { id: 'band_row', name: 'Húzógumis evezés', muscleGroup: 'hat', equipment: 'band', level: ALL_LEVELS, jointStress: [] },
  { id: 'db_row', name: 'Súlyzós egykaros evezés', muscleGroup: 'hat', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['derek'] },
  { id: 'db_deadlift', name: 'Súlyzós rúdemelés (deadlift)', muscleGroup: 'hat', equipment: 'dumbbell', level: INTER_ADV, jointStress: ['derek'] },
  { id: 'barbell_row', name: 'Rúddal döntött evezés', muscleGroup: 'hat', equipment: 'barbell', level: INTER_ADV, jointStress: ['derek'] },
  { id: 'barbell_deadlift', name: 'Rúdemelés (deadlift)', muscleGroup: 'hat', equipment: 'barbell', level: ['halado'], jointStress: ['derek'] },
  { id: 'lat_pulldown', name: 'Húzódzkodó gép (lat pulldown)', muscleGroup: 'hat', equipment: 'machine', level: ALL_LEVELS, jointStress: ['vall'] },
  { id: 'seated_row_machine', name: 'Ülő evezőgép', muscleGroup: 'hat', equipment: 'machine', level: ALL_LEVELS, jointStress: [] },
  { id: 'pullup', name: 'Húzódzkodás', muscleGroup: 'hat', equipment: 'bodyweight', level: ['halado'], jointStress: ['vall'] },
  { id: 'kb_swing', name: 'Kettlebell lengetés', muscleGroup: 'hat', equipment: 'kettlebell', level: INTER_ADV, jointStress: ['derek'] },

  // LÁB
  { id: 'bodyweight_squat', name: 'Guggolás (testsúlyos)', muscleGroup: 'lab', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'lunge', name: 'Kitörés', muscleGroup: 'lab', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'wall_sit', name: 'Fali szék', muscleGroup: 'lab', equipment: 'bodyweight', level: ['kezdo', 'kozephalado'], jointStress: ['terd'] },
  { id: 'db_squat', name: 'Súlyzós guggolás', muscleGroup: 'lab', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'db_lunge', name: 'Súlyzós kitörés', muscleGroup: 'lab', equipment: 'dumbbell', level: INTER_ADV, jointStress: ['terd'] },
  { id: 'goblet_squat_kb', name: 'Kettlebell guggolás (goblet)', muscleGroup: 'lab', equipment: 'kettlebell', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'barbell_squat', name: 'Rúddal guggolás', muscleGroup: 'lab', equipment: 'barbell', level: ['halado'], jointStress: ['terd', 'derek'] },
  { id: 'leg_press_machine', name: 'Lábtoló gép', muscleGroup: 'lab', equipment: 'machine', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'leg_extension_machine', name: 'Combfeszítő gép', muscleGroup: 'lab', equipment: 'machine', level: INTER_ADV, jointStress: ['terd'] },
  { id: 'leg_curl_machine', name: 'Combhajlító gép', muscleGroup: 'lab', equipment: 'machine', level: INTER_ADV, jointStress: [] },
  { id: 'calf_raise', name: 'Vádliemelés', muscleGroup: 'lab', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: [] },

  // FENÉK
  { id: 'glute_bridge', name: 'Fenékemelés (glute bridge)', muscleGroup: 'fenek', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: [] },
  { id: 'hip_thrust_db', name: 'Súlyzós csípőemelés', muscleGroup: 'fenek', equipment: 'dumbbell', level: INTER_ADV, jointStress: [] },
  { id: 'donkey_kick', name: 'Hátrarúgás (donkey kick)', muscleGroup: 'fenek', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: [] },
  { id: 'band_kickback', name: 'Húzógumis csípőnyújtás', muscleGroup: 'fenek', equipment: 'band', level: ALL_LEVELS, jointStress: [] },
  { id: 'sumo_squat_kb', name: 'Kettlebell szumó guggolás', muscleGroup: 'fenek', equipment: 'kettlebell', level: INTER_ADV, jointStress: ['terd'] },

  // VÁLL
  { id: 'pike_pushup', name: 'Pike fekvőtámasz', muscleGroup: 'vall', equipment: 'bodyweight', level: INTER_ADV, jointStress: ['csuklo', 'vall'] },
  { id: 'db_shoulder_press', name: 'Súlyzós vállból nyomás', muscleGroup: 'vall', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['vall'] },
  { id: 'db_lateral_raise', name: 'Súlyzós oldalemelés', muscleGroup: 'vall', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['vall'] },
  { id: 'band_face_pull', name: 'Húzógumis face pull', muscleGroup: 'vall', equipment: 'band', level: ALL_LEVELS, jointStress: [] },
  { id: 'barbell_ohp', name: 'Rúddal katonai nyomás', muscleGroup: 'vall', equipment: 'barbell', level: ['halado'], jointStress: ['vall'] },
  { id: 'shoulder_press_machine', name: 'Vállnyomó gép', muscleGroup: 'vall', equipment: 'machine', level: ALL_LEVELS, jointStress: [] },

  // BICEPSZ
  { id: 'db_curl', name: 'Súlyzós bicepszhajlítás', muscleGroup: 'bicepsz', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['csuklo'] },
  { id: 'band_curl', name: 'Húzógumis bicepszhajlítás', muscleGroup: 'bicepsz', equipment: 'band', level: ALL_LEVELS, jointStress: [] },
  { id: 'barbell_curl', name: 'Rúddal bicepszhajlítás', muscleGroup: 'bicepsz', equipment: 'barbell', level: INTER_ADV, jointStress: ['csuklo'] },
  { id: 'bicep_curl_machine', name: 'Bicepsz gép', muscleGroup: 'bicepsz', equipment: 'machine', level: ALL_LEVELS, jointStress: [] },

  // TRICEPSZ
  { id: 'triceps_dip_bodyweight', name: 'Tricepsz tolódzkodás (széken)', muscleGroup: 'tricepsz', equipment: 'bodyweight', level: INTER_ADV, jointStress: ['csuklo', 'vall'] },
  { id: 'diamond_pushup', name: 'Gyémánt fekvőtámasz', muscleGroup: 'tricepsz', equipment: 'bodyweight', level: ['halado'], jointStress: ['csuklo'] },
  { id: 'db_triceps_extension', name: 'Súlyzós tricepsz nyújtás', muscleGroup: 'tricepsz', equipment: 'dumbbell', level: ALL_LEVELS, jointStress: ['csuklo'] },
  { id: 'band_triceps_pushdown', name: 'Húzógumis tricepsz lenyomás', muscleGroup: 'tricepsz', equipment: 'band', level: ALL_LEVELS, jointStress: [] },
  { id: 'triceps_pushdown_machine', name: 'Kábeles tricepsz lenyomás', muscleGroup: 'tricepsz', equipment: 'machine', level: ALL_LEVELS, jointStress: [] },

  // HAS
  { id: 'plank', name: 'Plank (deszka tartás)', muscleGroup: 'has', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['csuklo'] },
  { id: 'crunch', name: 'Felülés (crunch)', muscleGroup: 'has', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['derek'] },
  { id: 'leg_raise', name: 'Lábemelés fekve', muscleGroup: 'has', equipment: 'bodyweight', level: INTER_ADV, jointStress: ['derek'] },
  { id: 'russian_twist', name: 'Orosz csavarás', muscleGroup: 'has', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['derek'] },
  { id: 'mountain_climber', name: 'Hegymászó (mountain climber)', muscleGroup: 'has', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['csuklo'] },
  { id: 'ab_wheel', name: 'Has kerék', muscleGroup: 'has', equipment: 'bodyweight', level: ['halado'], jointStress: ['derek'] },

  // CARDIO
  { id: 'jumping_jacks', name: 'Szökdelés (jumping jack)', muscleGroup: 'cardio', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'high_knees', name: 'Térdemelés futás helyben', muscleGroup: 'cardio', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'burpee', name: 'Burpee', muscleGroup: 'cardio', equipment: 'bodyweight', level: INTER_ADV, jointStress: ['terd', 'csuklo'] },
  { id: 'jump_rope', name: 'Kötélugrás', muscleGroup: 'cardio', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'treadmill', name: 'Futópad / futás', muscleGroup: 'cardio', equipment: 'cardio_machine', level: ALL_LEVELS, jointStress: ['terd'] },
  { id: 'bike', name: 'Szobabicikli', muscleGroup: 'cardio', equipment: 'cardio_machine', level: ALL_LEVELS, jointStress: [] },
  { id: 'rowing_machine', name: 'Evezőgép', muscleGroup: 'cardio', equipment: 'cardio_machine', level: ALL_LEVELS, jointStress: ['derek'] },
  { id: 'kb_swing_cardio', name: 'Kettlebell lengetés (kondi)', muscleGroup: 'cardio', equipment: 'kettlebell', level: INTER_ADV, jointStress: ['derek'] },

  // TELJES TEST
  { id: 'full_body_circuit', name: 'Vegyes körkörös (testsúly)', muscleGroup: 'teljes_test', equipment: 'bodyweight', level: ALL_LEVELS, jointStress: [] },
]

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id)
}
