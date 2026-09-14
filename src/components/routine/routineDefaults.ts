import type { Exercise, WorkoutDay } from '../../types/workout'

export interface RoutineMeta {
  dayName: string
  title: string
  tagline: string
  banner: string
  accentColor: WorkoutDay['accentColor']
}

export const AVAILABLE_BANNERS = [
  { id: '/assets/banner_leg_day.jpg', label: 'Pierna / Fuerza (Verde)' },
  { id: '/assets/banner_upper_body.jpg', label: 'Torso / Empuje-Tirón (Cyan)' },
  { id: '/assets/banner_full_body.jpg', label: 'Full Body (Púrpura)' },
  { id: '/assets/banner_rugby_conditioning.jpg', label: 'Rugby / Potencia (Ámbar)' }
]

export const createBlankRoutineMeta = (): RoutineMeta => ({
  dayName: 'Sábado',
  title: '',
  tagline: '',
  banner: '/assets/banner_upper_body.jpg',
  accentColor: 'cyan'
})

export const createDefaultRoutineMeta = (): RoutineMeta => ({
  ...createBlankRoutineMeta(),
  title: 'Brazos, Hombros & Core',
  tagline: 'Hipertrofia & Fuerza'
})

export const REST_OPTIONS = [0, 30, 45, 60, 75, 90, 120, 180]

export const createBlankExercise = (): Exercise => ({
  id: '',
  name: '',
  targetMuscles: 'Piernas / Torso',
  defaultSets: 3,
  repRange: '10-12',
  restSeconds: 60,
  restText: '60 s',
  alternative: 'Mancuernas / Polea',
  objective: 'Hipertrofia',
  defaultVideoUrl: undefined,
  techniqueCues: [
    'Mantener buena postura y control en todo el rango de movimiento',
    'Fase excéntrica controlada'
  ]
})
