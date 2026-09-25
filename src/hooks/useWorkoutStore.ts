import { useState, useEffect, useCallback, useRef } from 'react'
import { INITIAL_ROUTINES } from '../data/initialRoutines'
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '../data/exerciseLibrary'
import type { 
  WorkoutDay, 
  WorkoutSession, 
  PersonalRecord, 
  CustomExerciseLink, 
  ExerciseSessionLog,
  SetLog,
  UserProfile,
  LibraryExercise,
  RoutineAssignment
} from '../types/workout'
import { 
  seedExerciseLibrary, 
  fetchExerciseLibraryFromCloud,
  fetchAssignedRoutines, 
  fetchCloudProfiles, 
  assignRoutineToUser,
  unassignRoutineFromUser,
  syncAllToFirestore,
  isFirebaseConfigured,
  type CloudUserSummary
} from '../services/firebase'
import { playCountdownBeep, playSuccessChime } from '../utils/audio'
import confetti from 'canvas-confetti'

const DEFAULT_PROFILES: UserProfile[] = [
  { 
    id: 'perfil_1', 
    name: 'Cristóbal', 
    avatar: '🦍', 
    goal: 'Hipertrofia & Masa',
    weeklyTargetDays: 5,
    soundEnabled: true,
    vibrationEnabled: true,
    weightUnit: 'kg',
    createdAt: new Date().toISOString() 
  },
  {
    id: 'perfil_camilo_lazcano',
    name: 'Camilo Lazcano',
    avatar: '👑',
    goal: 'Fuerza Máxima',
    weeklyTargetDays: 5,
    soundEnabled: true,
    vibrationEnabled: true,
    weightUnit: 'kg',
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
]

const LIBRARY_CACHE_KEY = 'lazcakon_exercise_library'
const ASSIGNMENTS_LOG_KEY = 'lazcakon_admin_assignments'
const ADMIN_SEEDED_KEY = 'lazcakon_admin_profile_seeded'

const ROUTINES_SEED_VERSION = 2
const LEGACY_FACTORY_ROUTINE_IDS = [
  'lunes-leg-day',
  'martes-upper-body',
  'miercoles-full-body',
  'jueves-quad-strength',
  'viernes-rugby-power'
]

export interface LibraryUploadState {
  isUploading: boolean
  done: number
  total: number
  message: string | null
}

export interface RestTimerState {
  isActive: boolean
  totalSeconds: number
  remainingSeconds: number
  exerciseName: string
  isMinimized: boolean
  endsAt: number | null
}

const DEFAULT_REST_TIMER: RestTimerState = {
  isActive: false,
  totalSeconds: 0,
  remainingSeconds: 0,
  exerciseName: '',
  isMinimized: false,
  endsAt: null
}

export function useWorkoutStore() {
  // 1. Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('lazcakon_profiles')
      return saved ? JSON.parse(saved) : DEFAULT_PROFILES
    } catch {
      return DEFAULT_PROFILES
    }
  })

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lazcakon_active_profile_id')
      return saved || profiles[0]?.id || 'perfil_1'
    } catch {
      return 'perfil_1'
    }
  })

  // 2. Login state (Initial Login Screen)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lazcakon_is_logged_in')
      return saved !== null ? JSON.parse(saved) : (profiles.length > 0)
    } catch {
      return true
    }
  })

  const getStorageKey = (key: string) => `lazcakon_${activeProfileId}_${key}`

  // 3. Routines (Per profile)
  const [routines, setRoutines] = useState<WorkoutDay[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('routines'))
      return saved ? JSON.parse(saved) : INITIAL_ROUTINES
    } catch {
      return INITIAL_ROUTINES
    }
  })

  // 4. Active Workout Session
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('active_session'))
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // 5. History of Completed Workouts
  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('history'))
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // 6. Personal Records
  const [prs, setPrs] = useState<Record<string, PersonalRecord>>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('prs'))
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // 7. Custom Links & Tutorials
  const [customLinks, setCustomLinks] = useState<Record<string, CustomExerciseLink[]>>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('custom_links'))
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // 8. Selected Alternatives
  const [selectedAlternatives, setSelectedAlternatives] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('alternatives'))
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // 8b. Routines assigned by the trainer (kept separate from own routines)
  const [assignedRoutines, setAssignedRoutines] = useState<RoutineAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('assigned_routines'))
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // 9. Exercise Library (cached locally, syncable to Firebase)
  const [libraryExercises, setLibraryExercises] = useState<LibraryExercise[]>(() => {
    try {
      const saved = localStorage.getItem(LIBRARY_CACHE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return EXERCISE_LIBRARY
  })

  const [libraryUpload, setLibraryUpload] = useState<LibraryUploadState>({
    isUploading: false,
    done: 0,
    total: EXERCISE_LIBRARY.length,
    message: null
  })

  // 10. Cloud users & routine assignments
  const [cloudUsers, setCloudUsers] = useState<CloudUserSummary[]>([])
  const [assignments, setAssignments] = useState<RoutineAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(ASSIGNMENTS_LOG_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [assignmentStatus, setAssignmentStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // 11. Rest Timer State
  const [restTimer, setRestTimer] = useState<RestTimerState>(DEFAULT_REST_TIMER)

  // Tracks which profile's local data is currently loaded (prevents syncing stale data)
  const [loadedProfileId, setLoadedProfileId] = useState<string | null>(null)

  // Reload profile specific data whenever activeProfileId changes
  useEffect(() => {
    localStorage.setItem('lazcakon_active_profile_id', activeProfileId)

    try {
      const savedRoutines = localStorage.getItem(getStorageKey('routines'))
      setRoutines(savedRoutines ? JSON.parse(savedRoutines) : INITIAL_ROUTINES)

      const savedHistory = localStorage.getItem(getStorageKey('history'))
      setHistory(savedHistory ? JSON.parse(savedHistory) : [])

      const savedPrs = localStorage.getItem(getStorageKey('prs'))
      setPrs(savedPrs ? JSON.parse(savedPrs) : {})

      const savedLinks = localStorage.getItem(getStorageKey('custom_links'))
      setCustomLinks(savedLinks ? JSON.parse(savedLinks) : {})

      const savedAlts = localStorage.getItem(getStorageKey('alternatives'))
      setSelectedAlternatives(savedAlts ? JSON.parse(savedAlts) : {})

      const savedAssigned = localStorage.getItem(getStorageKey('assigned_routines'))
      setAssignedRoutines(savedAssigned ? JSON.parse(savedAssigned) : [])

      const savedSession = localStorage.getItem(getStorageKey('active_session'))
      setActiveSession(savedSession ? JSON.parse(savedSession) : null)

      // Restore a running rest timer (timestamp based, survives app background/close)
      const savedTimer = localStorage.getItem(getStorageKey('rest_timer'))
      if (savedTimer) {
        const parsed: RestTimerState = JSON.parse(savedTimer)
        if (parsed?.isActive && parsed.endsAt && parsed.endsAt > Date.now()) {
          setRestTimer({
            ...DEFAULT_REST_TIMER,
            ...parsed,
            remainingSeconds: Math.max(0, Math.ceil((parsed.endsAt - Date.now()) / 1000))
          })
        } else {
          setRestTimer(DEFAULT_REST_TIMER)
        }
      } else {
        setRestTimer(DEFAULT_REST_TIMER)
      }

      setLoadedProfileId(activeProfileId)
    } catch (err) {
      console.warn('Error loading profile data:', err)
    }
  }, [activeProfileId])

  useEffect(() => {
    localStorage.setItem('lazcakon_profiles', JSON.stringify(profiles))
  }, [profiles])

  useEffect(() => {
    localStorage.setItem('lazcakon_is_logged_in', JSON.stringify(isLoggedIn))
  }, [isLoggedIn])

  // Ensure the admin profile (Camilo Lazcano) exists on this device at least once
  useEffect(() => {
    try {
      if (localStorage.getItem(ADMIN_SEEDED_KEY)) return
      const adminDefault = DEFAULT_PROFILES.find(p => p.isAdmin)
      if (adminDefault && !profiles.some(p => p.id === adminDefault.id)) {
        setProfiles(prev => [...prev, { ...adminDefault, createdAt: new Date().toISOString() }])
      }
      localStorage.setItem(ADMIN_SEEDED_KEY, 'true')
    } catch {
      // safe fallback
    }
  }, [profiles])

  // Pull routines assigned by the trainer (cloud + pending local ones) into a
  // separate list so they never mix with the athlete's own routines
  useEffect(() => {
    if (!activeProfileId) return
    let cancelled = false

    const applyAssignments = async () => {
      let local: RoutineAssignment[] = []
      try {
        const rawLocal = localStorage.getItem(getStorageKey('assigned_routines'))
        const parsed = rawLocal ? JSON.parse(rawLocal) : []
        if (Array.isArray(parsed)) local = parsed
      } catch {
        local = []
      }

      let cloud: RoutineAssignment[] | null = null
      if (isFirebaseConfigured()) {
        const result = await fetchAssignedRoutines(activeProfileId)
        if (cancelled) return
        if (result.success) cloud = result.assignments
      }

      const base = cloud ?? local
      const baseIds = new Set(base.map(a => a.id))
      const pendingLocal = local.filter(a => a.pendingSync && !baseIds.has(a.id))
      const merged = [...base, ...pendingLocal]

      const byRoutine = new Map<string, RoutineAssignment>()
      merged
        .sort((a, b) => new Date(a.assignedAt).getTime() - new Date(b.assignedAt).getTime())
        .forEach(a => byRoutine.set(a.routineId, a))

      if (cancelled) return

      setAssignedRoutines(
        Array.from(byRoutine.values()).sort(
          (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
        )
      )
    }

    applyAssignments()

    const handleVisible = () => {
      if (!cancelled && document.visibilityState === 'visible') void applyAssignments()
    }

    document.addEventListener('visibilitychange', handleVisible)
    window.addEventListener('focus', handleVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisible)
      window.removeEventListener('focus', handleVisible)
    }
  }, [activeProfileId])

  // One-time migration: replace the old factory routines with the new 12-week
  // strength program, keeping any custom routines the profile created
  useEffect(() => {
    try {
      const versionKey = `lazcakon_${activeProfileId}_routines_seed_version`
      if (Number(localStorage.getItem(versionKey) || '1') >= ROUTINES_SEED_VERSION) return

      setRoutines(prev => {
        const customRoutines = prev.filter(r => !LEGACY_FACTORY_ROUTINE_IDS.includes(r.id))
        const hasLegacy = customRoutines.length !== prev.length
        if (!hasLegacy && prev.length > 0) return prev
        return [...INITIAL_ROUTINES, ...customRoutines]
      })
      localStorage.setItem(versionKey, String(ROUTINES_SEED_VERSION))
    } catch {
      // safe fallback
    }
  }, [activeProfileId])

  useEffect(() => {
    localStorage.setItem(getStorageKey('routines'), JSON.stringify(routines))
  }, [routines, activeProfileId])

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(getStorageKey('active_session'), JSON.stringify(activeSession))
    } else {
      localStorage.removeItem(getStorageKey('active_session'))
    }
  }, [activeSession, activeProfileId])

  useEffect(() => {
    localStorage.setItem(getStorageKey('history'), JSON.stringify(history))
  }, [history, activeProfileId])

  useEffect(() => {
    localStorage.setItem(getStorageKey('prs'), JSON.stringify(prs))
  }, [prs, activeProfileId])

  useEffect(() => {
    localStorage.setItem(getStorageKey('custom_links'), JSON.stringify(customLinks))
  }, [customLinks, activeProfileId])

  useEffect(() => {
    localStorage.setItem(getStorageKey('alternatives'), JSON.stringify(selectedAlternatives))
  }, [selectedAlternatives, activeProfileId])

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey('assigned_routines'), JSON.stringify(assignedRoutines))
    } catch {
      // safe fallback
    }
  }, [assignedRoutines])

  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_CACHE_KEY, JSON.stringify(libraryExercises))
    } catch {
      // safe fallback
    }
  }, [libraryExercises])

  useEffect(() => {
    try {
      localStorage.setItem(ASSIGNMENTS_LOG_KEY, JSON.stringify(assignments))
    } catch {
      // safe fallback
    }
  }, [assignments])

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0]

  // Rest Timer Logic: the countdown is derived from a real timestamp so it
  // keeps its pace while the app/tab is in the background or suspended
  useEffect(() => {
    if (!restTimer.isActive || !restTimer.endsAt) return

    const tick = () => {
      setRestTimer(prev => {
        if (!prev.isActive || !prev.endsAt) return prev

        const remaining = Math.max(0, Math.ceil((prev.endsAt - Date.now()) / 1000))

        if (remaining <= 0) {
          if (activeProfile?.soundEnabled !== false) playCountdownBeep(true)
          return { ...prev, remainingSeconds: 0, isActive: false, endsAt: null }
        }

        if (
          activeProfile?.soundEnabled !== false &&
          remaining < prev.remainingSeconds &&
          remaining <= 3
        ) {
          playCountdownBeep(false)
        }

        if (remaining === prev.remainingSeconds) return prev
        return { ...prev, remainingSeconds: remaining }
      })
    }

    tick()
    const interval = setInterval(tick, 250)

    const handleVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }

    document.addEventListener('visibilitychange', handleVisible)
    window.addEventListener('focus', handleVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisible)
      window.removeEventListener('focus', handleVisible)
    }
  }, [restTimer.isActive, restTimer.endsAt, activeProfile?.soundEnabled])

  // Persist the running rest timer so it survives app backgrounding / reopening
  useEffect(() => {
    try {
      if (restTimer.isActive && restTimer.endsAt) {
        localStorage.setItem(getStorageKey('rest_timer'), JSON.stringify(restTimer))
      } else {
        localStorage.removeItem(getStorageKey('rest_timer'))
      }
    } catch {
      // safe fallback
    }
  }, [restTimer])

  // --- PROFILE & LOGIN MANAGEMENT ---

  const login = useCallback((profileId: string) => {
    setActiveProfileId(profileId)
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
  }, [])

  const createProfile = useCallback((name: string, avatar: string = '🦍', goal: string = 'Hipertrofia & Masa') => {
    const newProfile: UserProfile = {
      id: 'perfil_' + Date.now(),
      name: name.trim() || 'Atleta',
      avatar: avatar || '🦍',
      goal: goal || 'Hipertrofia & Masa',
      weeklyTargetDays: 5,
      soundEnabled: true,
      vibrationEnabled: true,
      weightUnit: 'kg',
      createdAt: new Date().toISOString()
    }
    setProfiles(prev => [...prev, newProfile])
    setActiveProfileId(newProfile.id)
    setIsLoggedIn(true)
    return newProfile
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== activeProfileId) return p
      return { ...p, ...updates }
    }))
  }, [activeProfileId])

  const switchProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId)
    setIsLoggedIn(true)
  }, [])

  const deleteProfile = useCallback((profileId: string) => {
    if (profiles.length <= 1) return
    const remaining = profiles.filter(p => p.id !== profileId)
    setProfiles(remaining)
    if (activeProfileId === profileId) {
      setActiveProfileId(remaining[0]?.id || 'perfil_1')
    }
  }, [profiles, activeProfileId])

  // --- ROUTINES ---

  const createRoutine = useCallback((newDay: WorkoutDay) => {
    setRoutines(prev => [...prev, newDay])
  }, [])

  const updateRoutine = useCallback((updatedDay: WorkoutDay) => {
    setRoutines(prev => prev.map(r => r.id === updatedDay.id ? updatedDay : r))
  }, [])

  const deleteRoutine = useCallback((dayId: string) => {
    setRoutines(prev => prev.filter(r => r.id !== dayId))
  }, [])

  const resetRoutinesToDefault = useCallback(() => {
    setRoutines(INITIAL_ROUTINES)
  }, [])

  // --- EXERCISE LIBRARY & ROUTINE ASSIGNMENTS (ADMIN) ---

  const uploadExerciseLibrary = useCallback(async () => {
    setLibraryUpload({
      isUploading: true,
      done: 0,
      total: libraryExercises.length,
      message: null
    })

    const result = await seedExerciseLibrary(libraryExercises, (done, total) => {
      setLibraryUpload(prev => ({ ...prev, done, total }))
    })

    setLibraryUpload({
      isUploading: false,
      done: result.count,
      total: libraryExercises.length,
      message: result.message
    })

    return result
  }, [libraryExercises])

  const refreshLibraryFromCloud = useCallback(async () => {
    const result = await fetchExerciseLibraryFromCloud()
    if (result.success && result.exercises && result.exercises.length > 0) {
      setLibraryExercises(result.exercises)
    }
    return result
  }, [])

  const refreshCloudUsers = useCallback(async () => {
    const result = await fetchCloudProfiles()
    if (result.success) {
      setCloudUsers(result.users)
    }
    return result
  }, [])

  const assignRoutineToProfile = useCallback(async (
    targetProfileId: string,
    targetProfileName: string,
    routine: WorkoutDay
  ) => {
    const adminName = activeProfile?.name || 'Administrador'
    const isLocalTarget = profiles.some(p => p.id === targetProfileId)
    const assignment: RoutineAssignment = {
      id: 'assign_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      routineId: routine.id,
      routineTitle: routine.title,
      assignedToProfileId: targetProfileId,
      assignedToProfileName: targetProfileName,
      assignedByProfileId: activeProfileId,
      assignedByProfileName: adminName,
      assignedAt: new Date().toISOString(),
      routine
    }

    const cloudResult = await assignRoutineToUser(assignment)

    if (!cloudResult.success && !isLocalTarget) {
      setAssignmentStatus({ type: 'error', message: cloudResult.message })
      return cloudResult
    }

    if (!cloudResult.success) {
      assignment.pendingSync = true
    }

    setAssignments(prev => [assignment, ...prev.filter(a => a.id !== assignment.id)])

    // Apply immediately for profiles stored on this device
    if (isLocalTarget) {
      try {
        const targetKey = `lazcakon_${targetProfileId}_assigned_routines`
        const raw = localStorage.getItem(targetKey)
        const current: RoutineAssignment[] = raw ? JSON.parse(raw) : []
        const next = [
          assignment,
          ...current.filter(a => a.id !== assignment.id && a.routineId !== routine.id)
        ]
        localStorage.setItem(targetKey, JSON.stringify(next))

        if (targetProfileId === activeProfileId) {
          setAssignedRoutines(next)
        }
      } catch {
        // local apply is best-effort
      }
    }

    const message = cloudResult.success
      ? `Rutina "${routine.title}" asignada a ${targetProfileName}.`
      : `Rutina "${routine.title}" guardada para ${targetProfileName} en este dispositivo (sin conexión a la nube).`

    setAssignmentStatus({ type: 'success', message })

    return { success: true, message }
  }, [activeProfile, activeProfileId, profiles])

  const unassignRoutine = useCallback(async (assignment: RoutineAssignment) => {
    setAssignments(prev => prev.filter(a => a.id !== assignment.id))

    if (assignment.assignedToProfileId === activeProfileId) {
      setAssignedRoutines(prev => prev.filter(a => a.id !== assignment.id))
    }

    try {
      const targetKey = `lazcakon_${assignment.assignedToProfileId}_assigned_routines`
      const raw = localStorage.getItem(targetKey)
      if (raw) {
        const current: RoutineAssignment[] = JSON.parse(raw)
        localStorage.setItem(
          targetKey,
          JSON.stringify(current.filter(a => a.id !== assignment.id))
        )
      }
    } catch {
      // local apply is best-effort
    }

    const result = await unassignRoutineFromUser(assignment.assignedToProfileId, assignment.id)
    setAssignmentStatus({
      type: result.success ? 'success' : 'error',
      message: result.success
        ? `Rutina "${assignment.routineTitle}" desasignada de ${assignment.assignedToProfileName}.`
        : result.message
    })
    return result
  }, [activeProfileId])

  const duplicateAssignedRoutine = useCallback((assignmentId: string) => {
    const assignment = assignedRoutines.find(a => a.id === assignmentId)
    if (!assignment) return null

    const stamp = Date.now()
    const copy: WorkoutDay = {
      ...assignment.routine,
      id: `routine_${stamp}`,
      exercises: assignment.routine.exercises.map((exercise, index) => ({
        ...exercise,
        id: `ex_copy_${stamp}_${index}`
      }))
    }

    setRoutines(prev => [...prev, copy])
    return copy
  }, [assignedRoutines])

  const clearAssignmentStatus = useCallback(() => {
    setAssignmentStatus(null)
  }, [])

  const syncToCloud = useCallback(async () => {
    const result = await syncAllToFirestore(
      activeProfileId,
      activeProfile?.name || 'Atleta',
      routines,
      history,
      prs,
      customLinks,
      selectedAlternatives,
      {
        avatar: activeProfile?.avatar,
        goal: activeProfile?.goal,
        isAdmin: Boolean(activeProfile?.isAdmin)
      }
    )

    if (result.success && activeProfile?.isAdmin) {
      await refreshCloudUsers()
    }

    return result
  }, [
    activeProfileId,
    activeProfile,
    routines,
    history,
    prs,
    customLinks,
    selectedAlternatives,
    refreshCloudUsers
  ])

  // Keep the cloud copy of this profile fresh so the admin can see every user.
  // Only runs once per profile session to avoid syncing on every state change.
  const syncToCloudRef = useRef(syncToCloud)
  useEffect(() => {
    syncToCloudRef.current = syncToCloud
  }, [syncToCloud])

  const autoSyncedProfileRef = useRef<string | null>(null)
  useEffect(() => {
    if (!isLoggedIn || !activeProfileId || !isFirebaseConfigured()) return
    if (loadedProfileId !== activeProfileId) return
    if (autoSyncedProfileRef.current === activeProfileId) return
    autoSyncedProfileRef.current = activeProfileId
    void syncToCloudRef.current()
  }, [isLoggedIn, activeProfileId, loadedProfileId])

  // Admin panel always starts with the latest user list
  useEffect(() => {
    if (!activeProfile?.isAdmin || !isFirebaseConfigured()) return
    void refreshCloudUsers()
  }, [activeProfile?.isAdmin, refreshCloudUsers])

  // --- REST TIMER ---

  const startRestTimer = useCallback((seconds: number, exerciseName: string) => {
    if (seconds <= 0) return
    setRestTimer({
      isActive: true,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      exerciseName,
      isMinimized: false,
      endsAt: Date.now() + seconds * 1000
    })
  }, [])

  const stopRestTimer = useCallback(() => {
    setRestTimer(prev => ({ ...prev, isActive: false, remainingSeconds: 0, endsAt: null }))
  }, [])

  const adjustRestTimer = useCallback((delta: number) => {
    setRestTimer(prev => {
      const current = prev.endsAt
        ? Math.max(0, Math.ceil((prev.endsAt - Date.now()) / 1000))
        : prev.remainingSeconds
      const next = Math.max(5, current + delta)
      return {
        ...prev,
        remainingSeconds: next,
        totalSeconds: Math.max(prev.totalSeconds, next),
        isActive: true,
        endsAt: Date.now() + next * 1000
      }
    })
  }, [])

  const toggleRestTimerMinimized = useCallback(() => {
    setRestTimer(prev => ({ ...prev, isMinimized: !prev.isMinimized }))
  }, [])

  // --- WORKOUT EXECUTION ---

  const startWorkout = useCallback((dayId: string) => {
    const day =
      routines.find(r => r.id === dayId) ||
      assignedRoutines.find(a => a.routine.id === dayId)?.routine
    if (!day) return

    const lastSessionForDay = history.find(h => h.dayId === dayId && h.isFinished)
    const initialLogs: Record<string, ExerciseSessionLog> = {}

    day.exercises.forEach(ex => {
      const isAlt = !!selectedAlternatives[ex.id]
      const lastExLog = lastSessionForDay?.logs[ex.id]

      const sets: SetLog[] = Array.from({ length: ex.defaultSets }, (_, idx) => {
        const lastSet = lastExLog?.sets[idx]
        const prevWeight = typeof lastSet?.weight === 'number' ? lastSet.weight : undefined
        const prevReps = typeof lastSet?.reps === 'number' ? lastSet.reps : undefined

        return {
          setNumber: idx + 1,
          previousWeight: prevWeight,
          previousReps: prevReps,
          weight: typeof prevWeight === 'number' ? prevWeight : '',
          reps: '',
          completed: false
        }
      })

      initialLogs[ex.id] = {
        exerciseId: ex.id,
        exerciseName: ex.name,
        isAlternativeSelected: isAlt,
        activeName: isAlt ? ex.alternative : ex.name,
        restSeconds: ex.restSeconds,
        sets,
        notes: ''
      }
    })

    const newSession: WorkoutSession = {
      id: 'session_' + Date.now(),
      dayId: day.id,
      dayName: day.dayName,
      title: day.title,
      startedAt: new Date().toISOString(),
      logs: initialLogs,
      isFinished: false
    }

    setActiveSession(newSession)
  }, [routines, assignedRoutines, history, selectedAlternatives])

  const updateSet = useCallback((
    exerciseId: string, 
    setIndex: number, 
    field: 'weight' | 'reps' | 'rpe' | 'completed', 
    value: any
  ) => {
    setActiveSession(prev => {
      if (!prev) return null
      const exLog = prev.logs[exerciseId]
      if (!exLog) return prev

      const newSets = [...exLog.sets]
      const targetSet: SetLog = { ...newSets[setIndex], [field]: value }

      if (field === 'completed') {
        targetSet.completed = Boolean(value)
        if (value) {
          targetSet.completedAt = new Date().toISOString()
          if (exLog.restSeconds > 0) {
            startRestTimer(exLog.restSeconds, exLog.activeName)
          }
        }
      }

      newSets[setIndex] = targetSet

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [exerciseId]: {
            ...exLog,
            sets: newSets
          }
        }
      }
    })
  }, [startRestTimer])

  const addSetToExercise = useCallback((exerciseId: string) => {
    setActiveSession(prev => {
      if (!prev) return null
      const exLog = prev.logs[exerciseId]
      if (!exLog) return prev

      const lastSet = exLog.sets[exLog.sets.length - 1]
      const newSet: SetLog = {
        setNumber: exLog.sets.length + 1,
        previousWeight: lastSet?.previousWeight,
        previousReps: lastSet?.previousReps,
        weight: (typeof lastSet?.weight === 'number') ? lastSet.weight : '',
        reps: '',
        completed: false
      }

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [exerciseId]: {
            ...exLog,
            sets: [...exLog.sets, newSet]
          }
        }
      }
    })
  }, [])

  const removeSetFromExercise = useCallback((exerciseId: string, setIndex: number) => {
    setActiveSession(prev => {
      if (!prev) return null
      const exLog = prev.logs[exerciseId]
      if (!exLog || exLog.sets.length <= 1) return prev

      const newSets = exLog.sets.filter((_, idx) => idx !== setIndex).map((s, idx) => ({
        ...s,
        setNumber: idx + 1
      }))

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [exerciseId]: {
            ...exLog,
            sets: newSets
          }
        }
      }
    })
  }, [])

  const toggleExerciseAlternative = useCallback((exerciseId: string) => {
    setSelectedAlternatives(prev => {
      const nextVal = !prev[exerciseId]
      return { ...prev, [exerciseId]: nextVal }
    })

    setActiveSession(prev => {
      if (!prev || !prev.logs[exerciseId]) return prev
      const exLog = prev.logs[exerciseId]
      const day = routines.find(r => r.id === prev.dayId)
      const exDef = day?.exercises.find(e => e.id === exerciseId)
      if (!exDef) return prev

      const nextIsAlt = !exLog.isAlternativeSelected
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [exerciseId]: {
            ...exLog,
            isAlternativeSelected: nextIsAlt,
            activeName: nextIsAlt ? exDef.alternative : exDef.name
          }
        }
      }
    })
  }, [routines])

  const updateExerciseNotes = useCallback((exerciseId: string, notes: string) => {
    setActiveSession(prev => {
      if (!prev || !prev.logs[exerciseId]) return prev
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [exerciseId]: {
            ...prev.logs[exerciseId],
            notes
          }
        }
      }
    })
  }, [])

  const finishWorkout = useCallback(() => {
    if (!activeSession) return

    const endedAt = new Date().toISOString()
    const durationSeconds = Math.floor(
      (new Date(endedAt).getTime() - new Date(activeSession.startedAt).getTime()) / 1000
    )

    let totalVolume = 0
    const newPrs = { ...prs }
    let newPrAchieved = false

    Object.values(activeSession.logs).forEach(exLog => {
      exLog.sets.forEach(s => {
        if (s.completed && typeof s.weight === 'number' && typeof s.reps === 'number' && s.weight > 0 && s.reps > 0) {
          totalVolume += s.weight * s.reps

          const est1RM = Math.round(s.weight * (1 + s.reps / 30))
          const currentPr = newPrs[exLog.exerciseId]

          if (!currentPr || s.weight > currentPr.maxWeight || est1RM > currentPr.estimated1RM) {
            newPrs[exLog.exerciseId] = {
              exerciseId: exLog.exerciseId,
              exerciseName: exLog.activeName,
              maxWeight: Math.max(s.weight, currentPr?.maxWeight || 0),
              repsAtMaxWeight: s.reps,
              estimated1RM: Math.max(est1RM, currentPr?.estimated1RM || 0),
              date: endedAt
            }
            newPrAchieved = true
          }
        }
      })
    })

    const finishedSession: WorkoutSession = {
      ...activeSession,
      endedAt,
      durationSeconds,
      totalVolumeKg: Math.round(totalVolume),
      isFinished: true
    }

    setHistory(prev => [finishedSession, ...prev])
    if (newPrAchieved) {
      setPrs(newPrs)
    }

    setActiveSession(null)
    stopRestTimer()

    if (activeProfile?.soundEnabled !== false) {
      playSuccessChime()
    }
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch {
      // safe
    }
  }, [activeSession, prs, activeProfile?.soundEnabled, stopRestTimer])

  const cancelWorkout = useCallback(() => {
    setActiveSession(null)
    stopRestTimer()
  }, [stopRestTimer])

  // Custom Links
  const addCustomLink = useCallback((link: CustomExerciseLink) => {
    setCustomLinks(prev => {
      const list = prev[link.exerciseId] || []
      return {
        ...prev,
        [link.exerciseId]: [...list, link]
      }
    })
  }, [])

  const deleteCustomLink = useCallback((exerciseId: string, linkId: string) => {
    setCustomLinks(prev => {
      const list = prev[exerciseId] || []
      return {
        ...prev,
        [exerciseId]: list.filter(l => l.id !== linkId)
      }
    })
  }, [])

  // Backup Export / Import
  const exportBackupJSON = useCallback(() => {
    const data = {
      profile: activeProfile,
      profiles,
      activeProfileId,
      routines,
      history,
      prs,
      customLinks,
      selectedAlternatives,
      exportedAt: new Date().toISOString(),
      app: 'LAZCAKONGYM',
      version: '3.0.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lazcakongym_${activeProfile.name.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [activeProfile, profiles, activeProfileId, routines, history, prs, customLinks, selectedAlternatives])

  const importBackupJSON = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr)
      if (parsed.profiles) setProfiles(parsed.profiles)
      if (parsed.profile) updateProfile(parsed.profile)
      if (parsed.routines) setRoutines(parsed.routines)
      if (parsed.history) setHistory(parsed.history)
      if (parsed.prs) setPrs(parsed.prs)
      if (parsed.customLinks) setCustomLinks(parsed.customLinks)
      if (parsed.selectedAlternatives) setSelectedAlternatives(parsed.selectedAlternatives)
      return true
    } catch (err) {
      console.error('Failed to import backup JSON:', err)
      return false
    }
  }, [updateProfile])

  const ownRoutineIds = new Set(routines.map(r => r.id))
  const visibleAssignedRoutines = assignedRoutines.filter(a => !ownRoutineIds.has(a.routineId))
  const allRoutines = [...routines, ...visibleAssignedRoutines.map(a => a.routine)]

  return {
    isLoggedIn,
    login,
    logout,
    profiles,
    activeProfile,
    activeProfileId,
    createProfile,
    updateProfile,
    switchProfile,
    deleteProfile,
    routines,
    allRoutines,
    visibleAssignedRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    resetRoutinesToDefault,
    isAdmin: Boolean(activeProfile?.isAdmin),
    libraryExercises,
    libraryGroups: MUSCLE_GROUPS,
    libraryUpload,
    uploadExerciseLibrary,
    refreshLibraryFromCloud,
    cloudUsers,
    refreshCloudUsers,
    syncToCloud,
    assignments,
    assignedRoutines,
    assignRoutineToProfile,
    unassignRoutine,
    duplicateAssignedRoutine,
    assignmentStatus,
    clearAssignmentStatus,
    activeSession,
    history,
    prs,
    customLinks,
    selectedAlternatives,
    restTimer,
    startWorkout,
    updateSet,
    addSetToExercise,
    removeSetFromExercise,
    toggleExerciseAlternative,
    updateExerciseNotes,
    finishWorkout,
    cancelWorkout,
    startRestTimer,
    stopRestTimer,
    adjustRestTimer,
    toggleRestTimerMinimized,
    addCustomLink,
    deleteCustomLink,
    exportBackupJSON,
    importBackupJSON
  }
}
