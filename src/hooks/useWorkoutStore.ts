import { useState, useEffect, useCallback } from 'react'
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
  const [restTimer, setRestTimer] = useState<RestTimerState>({
    isActive: false,
    totalSeconds: 0,
    remainingSeconds: 0,
    exerciseName: '',
    isMinimized: false
  })

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

      const savedSession = localStorage.getItem(getStorageKey('active_session'))
      setActiveSession(savedSession ? JSON.parse(savedSession) : null)
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

  // Pull routines assigned by the admin from Firestore and merge them locally
  useEffect(() => {
    if (!activeProfileId || !isFirebaseConfigured()) return
    let cancelled = false

    const appliedKey = `lazcakon_${activeProfileId}_applied_assignments`

    const applyAssignments = async () => {
      const result = await fetchAssignedRoutines(activeProfileId)
      if (cancelled || !result.success || result.assignments.length === 0) return

      let applied: Record<string, boolean> = {}
      try {
        applied = JSON.parse(localStorage.getItem(appliedKey) || '{}')
      } catch {
        applied = {}
      }

      const pending = result.assignments.filter(a => !applied[a.id])
      if (pending.length === 0) return

      setRoutines(prev => {
        let next = [...prev]
        pending.forEach(assignment => {
          const idx = next.findIndex(r => r.id === assignment.routineId)
          if (idx >= 0) {
            next[idx] = assignment.routine
          } else {
            next = [...next, assignment.routine]
          }
          applied[assignment.id] = true
        })
        return next
      })

      try {
        localStorage.setItem(appliedKey, JSON.stringify(applied))
      } catch {
        // safe fallback
      }
    }

    applyAssignments()
    return () => {
      cancelled = true
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

  // Rest Timer Interval Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (restTimer.isActive && restTimer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (!prev.isActive) return prev
          const nextSec = prev.remainingSeconds - 1

          if (activeProfile?.soundEnabled !== false) {
            if (nextSec === 3 || nextSec === 2 || nextSec === 1) {
              playCountdownBeep(false)
            } else if (nextSec === 0) {
              playCountdownBeep(true)
            }
          }

          if (nextSec <= 0) {
            return {
              ...prev,
              remainingSeconds: 0,
              isActive: false
            }
          }
          return {
            ...prev,
            remainingSeconds: nextSec
          }
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [restTimer.isActive, restTimer.remainingSeconds, activeProfile?.soundEnabled])

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
    const assignment: RoutineAssignment = {
      id: 'assign_' + Date.now(),
      routineId: routine.id,
      routineTitle: routine.title,
      assignedToProfileId: targetProfileId,
      assignedToProfileName: targetProfileName,
      assignedByProfileId: activeProfileId,
      assignedByProfileName: adminName,
      assignedAt: new Date().toISOString(),
      routine
    }

    const result = await assignRoutineToUser(assignment)
    setAssignmentStatus({
      type: result.success ? 'success' : 'error',
      message: result.message
    })

    if (!result.success) return result

    setAssignments(prev => [assignment, ...prev.filter(a => a.id !== assignment.id)])

    // Apply immediately for profiles stored on this device
    try {
      const targetKey = `lazcakon_${targetProfileId}_routines`
      const raw = localStorage.getItem(targetKey)
      const targetRoutines: WorkoutDay[] = raw ? JSON.parse(raw) : INITIAL_ROUTINES
      const idx = targetRoutines.findIndex(r => r.id === routine.id)
      const next = idx >= 0
        ? targetRoutines.map(r => r.id === routine.id ? routine : r)
        : [...targetRoutines, routine]
      localStorage.setItem(targetKey, JSON.stringify(next))

      if (targetProfileId === activeProfileId) {
        setRoutines(next)
      }
    } catch {
      // local apply is best-effort
    }

    return result
  }, [activeProfile, activeProfileId])

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

  // --- REST TIMER ---

  const startRestTimer = useCallback((seconds: number, exerciseName: string) => {
    if (seconds <= 0) return
    setRestTimer({
      isActive: true,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      exerciseName,
      isMinimized: false
    })
  }, [])

  const stopRestTimer = useCallback(() => {
    setRestTimer(prev => ({ ...prev, isActive: false, remainingSeconds: 0 }))
  }, [])

  const adjustRestTimer = useCallback((delta: number) => {
    setRestTimer(prev => {
      const next = Math.max(5, prev.remainingSeconds + delta)
      return {
        ...prev,
        remainingSeconds: next,
        totalSeconds: Math.max(prev.totalSeconds, next),
        isActive: true
      }
    })
  }, [])

  const toggleRestTimerMinimized = useCallback(() => {
    setRestTimer(prev => ({ ...prev, isMinimized: !prev.isMinimized }))
  }, [])

  // --- WORKOUT EXECUTION ---

  const startWorkout = useCallback((dayId: string) => {
    const day = routines.find(r => r.id === dayId)
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
  }, [routines, history, selectedAlternatives])

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
    assignRoutineToProfile,
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
