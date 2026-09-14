export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo' | 'Personalizado'

export type MuscleGroup =
  | 'Abdomen'
  | 'Todos'
  | 'Pierna'
  | 'Espalda'
  | 'Hombro'
  | 'Tríceps'
  | 'Bíceps'
  | 'Pecho'
  | 'Cuello'
  | 'Antebrazo'

export interface LibraryExercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  url: string
}

export interface MuscleGroupMeta {
  id: MuscleGroup
  label: string
  accent: string
  count: number
}

export interface RoutineAssignment {
  id: string
  routineId: string
  routineTitle: string
  assignedToProfileId: string
  assignedToProfileName: string
  assignedByProfileId: string
  assignedByProfileName: string
  assignedAt: string
  routine: WorkoutDay
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  weightKg?: number
  heightCm?: number
  goal?: string
  weeklyTargetDays?: number
  soundEnabled?: boolean
  vibrationEnabled?: boolean
  weightUnit?: 'kg' | 'lbs'
  isAdmin?: boolean
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  targetMuscles: string
  defaultSets: number
  repRange: string
  restSeconds: number
  restText: string
  alternative: string
  objective: string
  defaultVideoUrl?: string
  techniqueCues?: string[]
}

export interface WorkoutDay {
  id: string
  dayName: string
  title: string
  tagline: string
  banner: string
  accentColor: 'emerald' | 'amber' | 'cyan' | 'purple'
  exercises: Exercise[]
}

export interface SetLog {
  setNumber: number
  previousWeight?: number
  previousReps?: number
  weight: number | ''
  reps: number | ''
  rpe?: number
  completed: boolean
  completedAt?: string
}

export interface ExerciseSessionLog {
  exerciseId: string
  exerciseName: string
  isAlternativeSelected: boolean
  activeName: string
  restSeconds: number
  sets: SetLog[]
  notes?: string
}

export interface WorkoutSession {
  id: string
  dayId: string
  dayName: string
  title: string
  startedAt: string
  endedAt?: string
  durationSeconds?: number
  logs: Record<string, ExerciseSessionLog>
  isFinished: boolean
  totalVolumeKg?: number
}

export interface PersonalRecord {
  exerciseId: string
  exerciseName: string
  maxWeight: number
  repsAtMaxWeight: number
  estimated1RM: number
  date: string
}

export interface CustomExerciseLink {
  id: string
  exerciseId: string
  title: string
  url: string
  platform: 'youtube' | 'instagram' | 'tiktok' | 'article' | 'other'
  notes?: string
}

export interface FirebaseSyncConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
  autoSync: boolean
  lastSyncedAt?: string
}
