import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  getDocs, 
  type Firestore,
  writeBatch
} from 'firebase/firestore'
import type { WorkoutSession, PersonalRecord, CustomExerciseLink, WorkoutDay } from '../types/workout'

export interface FirebaseConfigOptions {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

const STORAGE_KEY_FIREBASE = 'lazcakon_firebase_config'

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfigOptions = {
  apiKey: '',
  authDomain: '',
  projectId: 'lazcakongym',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
}

export function getSavedFirebaseConfig(): FirebaseConfigOptions {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE)
    if (saved) return JSON.parse(saved)
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

// Sync full profile data to Cloud Firestore
export async function syncAllToFirestore(
  profileId: string,
  profileName: string,
  routines: WorkoutDay[],
  history: WorkoutSession[],
  prs: Record<string, PersonalRecord>,
  customLinks: Record<string, CustomExerciseLink[]>,
  selectedAlternatives: Record<string, boolean>
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
