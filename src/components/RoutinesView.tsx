import React, { useEffect, useState } from 'react'
import { Play, Dumbbell, Info, Calculator, Plus, Edit3, RotateCcw, Copy, Send } from 'lucide-react'
import type { WorkoutDay, Exercise, RoutineAssignment } from '../types/workout'

interface RoutinesViewProps {
  routines: WorkoutDay[]
  assignedRoutines: RoutineAssignment[]
  selectedDayId?: string
  onStartWorkout: (dayId: string) => void
  onOpenExerciseModal: (exercise: Exercise) => void
  onOpenPlateCalculator: (weight?: number) => void
  selectedAlternatives: Record<string, boolean>
  onToggleAlternative: (exerciseId: string) => void
  onOpenCreateRoutine: () => void
  onOpenEditRoutine: (routine: WorkoutDay) => void
  onDuplicateAssignedRoutine: (assignmentId: string) => WorkoutDay | null
  onResetRoutines: () => void
}

type RoutineMode = 'mias' | 'asignadas'

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  routines,
  assignedRoutines,
  selectedDayId,
  onStartWorkout,
  onOpenExerciseModal,
  onOpenPlateCalculator,
  selectedAlternatives,
  onToggleAlternative,
  onOpenCreateRoutine,
  onOpenEditRoutine,
  onDuplicateAssignedRoutine,
  onResetRoutines
}) => {
  const ownRoutineIds = new Set(routines.map(r => r.id))
  const visibleAssigned = assignedRoutines.filter(a => !ownRoutineIds.has(a.routineId))

  const [mode, setMode] = useState<RoutineMode>('mias')
  const [activeDayId, setActiveDayId] = useState<string>(selectedDayId || routines[0]?.id || '')

  const listForMode = mode === 'mias' ? routines : visibleAssigned.map(a => a.routine)
  const currentDay = listForMode.find(r => r.id === activeDayId) || listForMode[0]
  const currentAssignment = mode === 'asignadas'
    ? visibleAssigned.find(a => a.routine.id === currentDay?.id) || null
    : null

  // Follow the routine selected from the dashboard
  useEffect(() => {
    if (!selectedDayId) return
    if (visibleAssigned.some(a => a.routine.id === selectedDayId) && !ownRoutineIds.has(selectedDayId)) {
      setMode('asignadas')
      setActiveDayId(selectedDayId)
    } else if (routines.some(r => r.id === selectedDayId)) {
      setMode('mias')
      setActiveDayId(selectedDayId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayId])

  // Keep a valid selection when switching tabs or deleting routines
  useEffect(() => {
    if (listForMode.some(r => r.id === activeDayId)) return
    setActiveDayId(listForMode[0]?.id || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, routines.length, visibleAssigned.length])

  const handleDuplicate = (assignmentId: string) => {
    const copy = onDuplicateAssignedRoutine(assignmentId)
    if (copy) {
      setMode('mias')
      setActiveDayId(copy.id)
    }
  }

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-5 lg:space-y-0 lg:items-start lg:pb-4">
      {/* Own / Assigned tabs */}
      <div className="flex items-center gap-2 lg:col-span-2 lg:row-start-1">
        <button
          onClick={() => setMode('mias')}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-black border transition-all active:scale-98 ${
            mode === 'mias'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          Mis Rutinas ({routines.length})
        </button>
        <button
          onClick={() => setMode('asignadas')}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-black border transition-all active:scale-98 flex items-center justify-center gap-1.5 ${
            mode === 'asignadas'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Asignadas ({visibleAssigned.length})</span>
        </button>
      </div>

      {/* Routine selector pills & Add Routine button */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 lg:col-span-2 lg:row-start-2 lg:mx-0 lg:px-0">
        {listForMode.map(day => {
          const isSelected = day.id === currentDay?.id
          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-black transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-400'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{day.dayName}</span>
            </button>
          )
        })}

        {mode === 'mias' && (
          <button
            onClick={onOpenCreateRoutine}
            className="flex-shrink-0 px-3 py-2 rounded-2xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700/80 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Rutina</span>
          </button>
        )}
      </div>

      {/* Empty state */}
      {!currentDay && (
        <div className="py-10 px-4 text-center space-y-3 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 lg:col-span-2 lg:row-start-3">
          <p className="text-sm font-black text-white">
            {mode === 'mias' ? 'Todavía no tienes rutinas propias' : 'No tienes rutinas asignadas'}
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {mode === 'mias'
              ? 'Crea tu primera rutina personalizada o duplica una de las que te asignó tu entrenador.'
              : 'Cuando tu entrenador te asigne una rutina aparecerá aquí automáticamente.'}
          </p>
          {mode === 'mias' ? (
            <button
              onClick={onOpenCreateRoutine}
              className="py-2.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear Rutina</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('mias')}
              className="py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Ir a Mis Rutinas</span>
            </button>
          )}
        </div>
      )}

      {/* Routine Banner & Header */}
      {currentDay && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl relative lg:col-start-2 lg:row-start-3 lg:sticky lg:top-20">
          <div className="h-44 w-full relative">
            <img
              src={currentDay.banner}
              alt={currentDay.title}
              className="w-full h-full object-cover object-center brightness-75"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/60 to-transparent"></div>

            <div className="absolute top-3 right-3 flex flex-wrap items-center justify-end gap-1.5">
              {currentAssignment ? (
                <button
                  onClick={() => handleDuplicate(currentAssignment.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 text-xs font-bold backdrop-blur-md border border-slate-700 shadow-lg flex items-center gap-1 active:scale-95 transition-all"
                  title="Copiar esta rutina a Mis Rutinas para editarla"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicar a Mis Rutinas</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenEditRoutine(currentDay)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 text-xs font-bold backdrop-blur-md border border-slate-700 shadow-lg flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Rutina</span>
                </button>
              )}
            </div>

            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow">
                  {currentDay.dayName}
                </span>
                {currentAssignment && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow">
                    Asignada por {currentAssignment.assignedByProfileName}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">{currentDay.title}</h2>
              <p className="text-xs text-slate-300 font-medium">{currentDay.tagline}</p>
            </div>
          </div>

          <div className="p-4 pt-2 space-y-2">
            <button
              onClick={() => onStartWorkout(currentDay.id)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>COMENZAR ESTE ENTRENAMIENTO</span>
            </button>

            {currentAssignment && (
              <p className="text-[11px] text-slate-500 text-center">
                Rutina asignada por tu entrenador • solo lectura. Puedes duplicarla para personalizarla.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Exercise Cards List */}
      {currentDay && (
        <div className="space-y-3 lg:col-start-1 lg:row-start-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Lista de Ejercicios ({currentDay.exercises.length})
            </h3>
            {mode === 'mias' && (
              <button
                onClick={() => onOpenEditRoutine(currentDay)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar / Editar</span>
              </button>
            )}
          </div>

          {currentDay.exercises.map((exercise, idx) => {
            const isAltSelected = !!selectedAlternatives[exercise.id]
            const displayName = isAltSelected ? exercise.alternative : exercise.name

            return (
              <div
                key={exercise.id}
                className="p-4 rounded-2xl bg-[#0e1526] border border-slate-800/80 hover:border-slate-700/90 transition-all shadow-md space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {exercise.targetMuscles}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {exercise.objective}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white mt-1.5">{displayName}</h4>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onOpenPlateCalculator(100)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700/60 transition-all"
                      title="Calculadora de Discos"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenExerciseModal(exercise)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
                      title="Ver técnica e hipervínculos"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stats badges (Series, Reps, Rest) */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Series</span>
                    <span className="font-extrabold text-white">{exercise.defaultSets}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reps / Tiempo</span>
                    <span className="font-extrabold text-emerald-400">{exercise.repRange}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Descanso</span>
                    <span className="font-extrabold text-amber-400">{exercise.restText}</span>
                  </div>
                </div>

                {/* Alternative row */}
                {exercise.alternative && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-400 truncate">
                      <Dumbbell className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">Alt: <strong className="text-slate-200">{exercise.alternative}</strong></span>
                    </div>
                    <button
                      onClick={() => onToggleAlternative(exercise.id)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all flex-shrink-0 ml-2 ${
                        isAltSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {isAltSelected ? '✓ Alternativa' : 'Usar Alt'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Reset to initial routines button (own routines only) */}
      {mode === 'mias' && (
        <div className="pt-3 text-center lg:col-span-2 lg:row-start-4">
          <button
            onClick={() => {
              if (confirm('¿Restablecer las rutinas a la configuración inicial de 5 días?')) {
                onResetRoutines()
              }
            }}
            className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1 py-2 px-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer rutinas de fábrica</span>
          </button>
        </div>
      )}
    </div>
  )
}
