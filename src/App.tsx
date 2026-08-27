import { useState } from 'react'
import { useWorkoutStore } from './hooks/useWorkoutStore'
import { Navbar } from './components/Navbar'
import { BottomNav, type NavTab } from './components/BottomNav'
import { HomeDashboard } from './components/HomeDashboard'
import { RoutinesView } from './components/RoutinesView'
import { ActiveWorkoutView } from './components/ActiveWorkoutView'
import { StatsView } from './components/StatsView'
import { UserSettingsView } from './components/UserSettingsView'
import { FloatingRestTimer } from './components/FloatingRestTimer'
import { ExerciseModal } from './components/ExerciseModal'
import { PlateCalculatorModal } from './components/PlateCalculatorModal'
import { ProfileSwitcherModal } from './components/ProfileSwitcherModal'
import { RoutineEditorModal } from './components/RoutineEditorModal'
import { LoginScreen } from './components/LoginScreen'
import type { Exercise, WorkoutDay } from './types/workout'

export function App() {
  const store = useWorkoutStore()
  const [currentTab, setCurrentTab] = useState<NavTab>('hoy')
  const [selectedDayForRoutines, setSelectedDayForRoutines] = useState<string>('lunes-leg-day')

  // Modals state
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null)
  const [plateCalcOpen, setPlateCalcOpen] = useState(false)
  const [plateCalcInitialWeight, setPlateCalcInitialWeight] = useState<number>(100)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [routineEditorOpen, setRoutineEditorOpen] = useState(false)
  const [routineToEdit, setRoutineToEdit] = useState<WorkoutDay | null>(null)

  // If not logged in, render the Login / Welcome Screen
  if (!store.isLoggedIn) {
    return (
      <LoginScreen
        profiles={store.profiles}
        onSelectProfile={store.login}
        onCreateProfile={store.createProfile}
        onDeleteProfile={store.deleteProfile}
      />
    )
  }

  // Start Workout and switch to Active Tab
  const handleStartWorkout = (dayId: string) => {
    store.startWorkout(dayId)
    setCurrentTab('activo')
  }

  const handleSelectDayFromDashboard = (day: WorkoutDay) => {
    setSelectedDayForRoutines(day.id)
    setCurrentTab('rutinas')
  }

  const handleOpenPlateCalc = (weight?: number) => {
    if (weight && weight > 0) {
      setPlateCalcInitialWeight(weight)
    }
    setPlateCalcOpen(true)
  }

  const handleOpenCreateRoutine = () => {
    setRoutineToEdit(null)
    setRoutineEditorOpen(true)
  }

  const handleOpenEditRoutine = (routine: WorkoutDay) => {
    setRoutineToEdit(routine)
    setRoutineEditorOpen(true)
  }

  const handleSaveRoutine = (routine: WorkoutDay) => {
    if (routineToEdit) {
      store.updateRoutine(routine)
    } else {
      store.createRoutine(routine)
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Mobile Navbar */}
      <Navbar
        activeSessionActive={!!store.activeSession}
        onNavigateActive={() => setCurrentTab('activo')}
        activeProfile={store.activeProfile}
        onOpenProfileSwitcher={() => setProfileModalOpen(true)}
      />

      {/* Main Content Area (Optimized for Mobile Screens) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-20">
        {currentTab === 'hoy' && (
          <HomeDashboard
            routines={store.routines}
            history={store.history}
            prs={store.prs}
            activeSession={store.activeSession}
            activeProfile={store.activeProfile}
            onStartWorkout={handleStartWorkout}
            onNavigateActive={() => setCurrentTab('activo')}
            onSelectDay={handleSelectDayFromDashboard}
            onOpenCreateRoutine={handleOpenCreateRoutine}
          />
        )}

        {currentTab === 'rutinas' && (
          <RoutinesView
            routines={store.routines}
            selectedDayId={selectedDayForRoutines}
            onStartWorkout={handleStartWorkout}
            onOpenExerciseModal={setActiveExerciseModal}
            onOpenPlateCalculator={handleOpenPlateCalc}
            selectedAlternatives={store.selectedAlternatives}
            onToggleAlternative={store.toggleExerciseAlternative}
            onOpenCreateRoutine={handleOpenCreateRoutine}
            onOpenEditRoutine={handleOpenEditRoutine}
            onResetRoutines={store.resetRoutinesToDefault}
          />
        )}

        {currentTab === 'activo' && (
          store.activeSession ? (
            <ActiveWorkoutView
              activeSession={store.activeSession}
              routines={store.routines}
              onUpdateSet={store.updateSet}
              onAddSet={store.addSetToExercise}
              onRemoveSet={store.removeSetFromExercise}
              onToggleAlternative={store.toggleExerciseAlternative}
              onUpdateNotes={store.updateExerciseNotes}
              onFinishWorkout={store.finishWorkout}
              onCancelWorkout={store.cancelWorkout}
              onOpenExerciseModal={setActiveExerciseModal}
              onOpenPlateCalculator={handleOpenPlateCalc}
            />
          ) : (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl">
                🏋️‍♂️
              </div>
              <h3 className="text-lg font-black text-white">No hay entrenamiento en curso</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Selecciona una de tus rutinas personalizadas para iniciar tu sesión de entrenamiento con temporizadores y registro en vivo.
              </p>
              <button
                onClick={() => setCurrentTab('rutinas')}
                className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Ver Rutinas de Entrenamiento
              </button>
            </div>
          )
        )}

        {currentTab === 'records' && (
          <StatsView
            prs={store.prs}
            history={store.history}
            onOpenPlateCalculator={handleOpenPlateCalc}
          />
        )}

        {currentTab === 'cloud' && (
          <UserSettingsView
            activeProfile={store.activeProfile}
            onUpdateProfile={store.updateProfile}
            onOpenProfileSwitcher={() => setProfileModalOpen(true)}
            onLogout={store.logout}
            onOpenPlateCalculator={handleOpenPlateCalc}
            onExportBackup={store.exportBackupJSON}
            onImportBackup={store.importBackupJSON}
            onResetRoutines={store.resetRoutinesToDefault}
          />
        )}
      </main>

      {/* Floating Rest Timer */}
      <FloatingRestTimer
        timer={store.restTimer}
        onStop={store.stopRestTimer}
        onAdjust={store.adjustRestTimer}
        onToggleMinimize={store.toggleRestTimerMinimized}
      />

      {/* Exercise Detail & Hyperlinks Modal */}
      <ExerciseModal
        exercise={activeExerciseModal}
        isOpen={!!activeExerciseModal}
        onClose={() => setActiveExerciseModal(null)}
        customLinks={activeExerciseModal ? (store.customLinks[activeExerciseModal.id] || []) : []}
        onAddCustomLink={store.addCustomLink}
        onDeleteCustomLink={store.deleteCustomLink}
        isAlternativeSelected={activeExerciseModal ? !!store.selectedAlternatives[activeExerciseModal.id] : false}
        onToggleAlternative={store.toggleExerciseAlternative}
      />

      {/* Plate Calculator Modal */}
      <PlateCalculatorModal
        isOpen={plateCalcOpen}
        onClose={() => setPlateCalcOpen(false)}
        initialWeight={plateCalcInitialWeight}
      />

      {/* Profile Switcher Modal */}
      <ProfileSwitcherModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profiles={store.profiles}
        activeProfileId={store.activeProfileId}
        onSwitchProfile={store.switchProfile}
        onCreateProfile={store.createProfile}
        onDeleteProfile={store.deleteProfile}
      />

      {/* Routine Editor Modal (Custom Routines & Exercises) */}
      <RoutineEditorModal
        isOpen={routineEditorOpen}
        onClose={() => {
          setRoutineEditorOpen(false)
          setRoutineToEdit(null)
        }}
        onSaveRoutine={handleSaveRoutine}
        onDeleteRoutine={store.deleteRoutine}
        routineToEdit={routineToEdit}
      />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        hasActiveWorkout={!!store.activeSession}
      />
    </div>
  )
}

export default App
