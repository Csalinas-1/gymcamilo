import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { 
  getFirestore, 
  doc, 
  getDoc,
  setDoc, 
  collection, 
  getDocs, 
  type Firestore,
  writeBatch
} from 'firebase/firestore'
import type { 
  WorkoutSession, 
  PersonalRecord, 
  CustomExerciseLink, 
  WorkoutDay,
  LibraryExercise,
  RoutineAssignment
} from '../types/workout'

export interface FirebaseConfigOptions {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export interface CloudUserSummary {
  id: string
  name: string
  avatar?: string
  goal?: string
  isAdmin?: boolean
  lastSyncedAt?: string
}

const STORAGE_KEY_FIREBASE = 'lazcakon_firebase_config'

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfigOptions = {
  apiKey: 'AIzaSyBX3tH9JEkRJYVZ7wNNxCsgBNfQ79pNJis',
  authDomain: 'lazcakongym.firebaseapp.com',
  projectId: 'lazcakongym',
  storageBucket: 'lazcakongym.firebasestorage.app',
  messagingSenderId: '133586915844',
  appId: '1:133586915844:web:020e888e1bb12a08255b51'
}

export function getSavedFirebaseConfig(): FirebaseConfigOptions {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...DEFAULT_FIREBASE_CONFIG, ...parsed, apiKey: parsed.apiKey || DEFAULT_FIREBASE_CONFIG.apiKey }
    }
  } catch {
    // fallback
  }
  return DEFAULT_FIREBASE_CONFIG
}

export function saveFirebaseConfig(config: FirebaseConfigOptions) {
  localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config))
}

let firebaseApp: FirebaseApp | null = null
let firestoreDb: Firestore | null = null

export function initFirebase(config?: FirebaseConfigOptions): { app: FirebaseApp; db: Firestore } | null {
  try {
    const currentConfig = config || getSavedFirebaseConfig()
    if (!currentConfig.apiKey || !currentConfig.projectId) {
      return null
    }

    if (!getApps().length) {
      firebaseApp = initializeApp(currentConfig)
    } else {
      firebaseApp = getApp()
    }

    firestoreDb = getFirestore(firebaseApp)
    return { app: firebaseApp, db: firestoreDb }
  } catch (error) {
    console.warn('Firebase initialization error:', error)
    return null
  }
}

export function isFirebaseConfigured(): boolean {
  const currentConfig = getSavedFirebaseConfig()
  return Boolean(currentConfig.apiKey && currentConfig.projectId)
}

// --- EXERCISE LIBRARY ---

// Upload the bundled 752-exercise library to the Firestore `exercises` collection
export async function seedExerciseLibrary(
  exercises: LibraryExercise[],
  onProgress?: (done: number, total: number) => void
): Promise<{ success: boolean; message: string; count: number }> {
  try {
    const instance = initFirebase()
    if (!instance) {
      return { success: false, message: 'Firebase no está configurado.', count: 0 }
    }

    const { db } = instance
    const CHUNK_SIZE = 400
    let done = 0

    for (let i = 0; i < exercises.length; i += CHUNK_SIZE) {
      const chunk = exercises.slice(i, i + CHUNK_SIZE)
      const batch = writeBatch(db)

      chunk.forEach(exercise => {
        const ref = doc(db, 'exercises', exercise.id)
        batch.set(ref, {
          ...exercise,
          libraryVersion: 1,
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })

      await batch.commit()
      done += chunk.length
      onProgress?.(done, exercises.length)
    }

    return {
      success: true,
      message: `Librería subida a Firebase: ${done} ejercicios.`,
      count: done
    }
  } catch (error: any) {
    console.error('Exercise library seed error:', error)
    return {
      success: false,
      message: error.message || 'Error al subir la librería a Firebase.',
      count: 0
    }
  }
}

export async function fetchExerciseLibraryFromCloud(): Promise<{
  success: boolean
  exercises?: LibraryExercise[]
}> {
  try {
    const instance = initFirebase()
    if (!instance) return { success: false }

    const { db } = instance
    const snap = await getDocs(collection(db, 'exercises'))
    const exercises: LibraryExercise[] = []
    snap.forEach(docSnap => {
      const data = docSnap.data()
      if (data.id && data.name && data.muscleGroup) {
        exercises.push({
          id: data.id,
          name: data.name,
          muscleGroup: data.muscleGroup,
          url: data.url || ''
        })
      }
    })

    return { success: true, exercises }
  } catch (err) {
    console.warn('Exercise library fetch error:', err)
    return { success: false }
  }
}

// --- CLOUD USERS ---

export async function fetchCloudProfiles(): Promise<{ success: boolean; users: CloudUserSummary[] }> {
  try {
    const instance = initFirebase()
    if (!instance) return { success: false, users: [] }

    const { db } = instance
    const snap = await getDocs(collection(db, 'users'))
    const users: CloudUserSummary[] = []
    snap.forEach(docSnap => {
      const data = docSnap.data()
      users.push({
        id: docSnap.id,
        name: data.profileName || data.name || docSnap.id,
        avatar: data.avatar,
        goal: data.goal,
        isAdmin: Boolean(data.isAdmin),
        lastSyncedAt: data.lastSyncedAt
      })
    })

    users.sort((a, b) => a.name.localeCompare(b.name))
    return { success: true, users }
  } catch (err) {
    console.warn('Cloud profiles fetch error:', err)
    return { success: false, users: [] }
  }
}

// --- ROUTINE ASSIGNMENTS ---

export async function assignRoutineToUser(
  assignment: RoutineAssignment
): Promise<{ success: boolean; message: string }> {
  try {
    const instance = initFirebase()
    if (!instance) {
      return { success: false, message: 'Firebase no está configurado.' }
    }

    const { db } = instance
    const userRef = doc(db, 'users', assignment.assignedToProfileId)
    await setDoc(userRef, {
      assignedRoutines: {
        [assignment.id]: assignment
      },
      updatedAt: new Date().toISOString()
    }, { merge: true })

    return {
      success: true,
      message: `Rutina "${assignment.routineTitle}" asignada a ${assignment.assignedToProfileName}.`
    }
  } catch (error: any) {
    console.error('Routine assignment error:', error)
    return {
      success: false,
      message: error.message || 'Error al asignar la rutina en Firebase.'
    }
  }
}

export async function fetchAssignedRoutines(profileId: string): Promise<{
  success: boolean
  assignments: RoutineAssignment[]
}> {
  try {
    const instance = initFirebase()
    if (!instance) return { success: false, assignments: [] }

    const { db } = instance
    const snap = await getDoc(doc(db, 'users', profileId))
    if (!snap.exists()) return { success: true, assignments: [] }

    const data = snap.data()
    const raw = data.assignedRoutines || {}
    const assignments: RoutineAssignment[] = Object.values(raw).filter(
      (item: any): item is RoutineAssignment => Boolean(item && item.id && item.routine)
    )

    assignments.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
    return { success: true, assignments }
  } catch (err) {
    console.warn('Assigned routines fetch error:', err)
    return { success: false, assignments: [] }
  }
}

// --- FULL PROFILE SYNC ---

// Sync full profile data to Cloud Firestore
export async function syncAllToFirestore(
  profileId: string,
  profileName: string,
  routines: WorkoutDay[],
  history: WorkoutSession[],
  prs: Record<string, PersonalRecord>,
  customLinks: Record<string, CustomExerciseLink[]>,
  selectedAlternatives: Record<string, boolean>,
  profileMeta: { avatar?: string; goal?: string; isAdmin?: boolean } = {}
): Promise<{ success: boolean; message: string }> {
  try {
    const instance = initFirebase()
    if (!instance) {
      return {
        success: false,
        message: 'Configura tus credenciales de Firebase en Ajustes para sincronizar con la nube.'
      }
    }

    const { db } = instance
    const safeProfileId = profileId || 'default_user'
    const batch = writeBatch(db)

    // 1. Sync User Profile, Routines & Preferences
    const userDocRef = doc(db, 'users', safeProfileId)
    batch.set(userDocRef, {
      profileName,
      avatar: profileMeta.avatar,
      goal: profileMeta.goal,
      isAdmin: Boolean(profileMeta.isAdmin),
      routines,
      selectedAlternatives,
      lastSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true })

    // 2. Sync PRs
    const prsDocRef = doc(db, 'users', safeProfileId, 'records', 'personal_records')
    batch.set(prsDocRef, {
      prs,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    // 3. Sync Custom Links
    const linksDocRef = doc(db, 'users', safeProfileId, 'links', 'custom_links')
    batch.set(linksDocRef, {
      customLinks,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    await batch.commit()

    // 4. Sync Workouts to Subcollection
    for (const session of history.slice(0, 30)) {
      const workoutRef = doc(db, 'users', safeProfileId, 'workouts', session.id)
      await setDoc(workoutRef, {
        ...session,
        syncedAt: new Date().toISOString()
      }, { merge: true })
    }

    return {
      success: true,
      message: '¡Datos sincronizados con Google Firebase exitosamente!'
    }
  } catch (error: any) {
    console.error('Firestore sync error:', error)
    return {
      success: false,
      message: error.message || 'Error al conectar con Cloud Firestore.'
    }
  }
}

// Fetch remote workouts from Firestore
export async function fetchFromFirestore(profileId: string): Promise<{
  history?: WorkoutSession[]
  routines?: WorkoutDay[]
  success: boolean
}> {
  try {
    const instance = initFirebase()
    if (!instance) return { success: false }

    const { db } = instance
    const safeProfileId = profileId || 'default_user'

    const workoutsSnap = await getDocs(collection(db, 'users', safeProfileId, 'workouts'))
    const history: WorkoutSession[] = []
    workoutsSnap.forEach(docSnap => {
      history.push(docSnap.data() as WorkoutSession)
    })

    history.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    return { history, success: true }
  } catch (err) {
    console.error('Firestore fetch error:', err)
    return { success: false }
  }
}
