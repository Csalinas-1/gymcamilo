import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit3,
  BookOpen,
  Save,
  Check,
  AlertTriangle,
  Calendar,
  Dumbbell,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import type { WorkoutDay, Exercise, LibraryExercise, MuscleGroupMeta } from '../types/workout'
import { RoutineMetaFields } from './routine/RoutineMetaFields'
import { createBlankRoutineMeta, createBlankExercise, type RoutineMeta } from './routine/routineDefaults'
import { ExerciseFields } from './routine/ExerciseFields'
import { ExerciseLibraryList } from './routine/ExerciseLibraryList'
import { ExerciseLibraryPicker } from './ExerciseLibraryPicker'

interface RoutineBuilderViewProps {
  routines: WorkoutDay[]
  libraryExercises: LibraryExercise[]
  libraryGroups: MuscleGroupMeta[]
  initialRoutineId?: string | null
  requestToken?: number
  onCreateRoutine: (routine: WorkoutDay) => void
  onUpdateRoutine: (routine: WorkoutDay) => void
  onDeleteRoutine: (routineId: string) => void
}

interface BuilderDraft {
  selectedId: string | null
  meta: RoutineMeta
  exercises: Exercise[]
  isDirty: boolean
  isNew: boolean
}

const DRAFT_STORAGE_KEY = 'lazcakon_builder_draft'

const cloneExercises = (exercises: Exercise[]): Exercise[] =>
  exercises.map(exercise => ({
    ...exercise,
    techniqueCues: exercise.techniqueCues ? [...exercise.techniqueCues] : undefined
  }))

const routineToDraft = (routine: WorkoutDay): BuilderDraft => ({
  selectedId: routine.id,
  meta: {
    dayName: routine.dayName,
    title: routine.title,
    tagline: routine.tagline,
    banner: routine.banner,
    accentColor: routine.accentColor
  },
  exercises: cloneExercises(routine.exercises),
  isDirty: false,
  isNew: false
})

const blankDraft = (): BuilderDraft => ({
  selectedId: null,
  meta: createBlankRoutineMeta(),
  exercises: [],
  isDirty: true,
  isNew: true
})

const loadPersistedDraft = (): BuilderDraft | null => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.meta || !Array.isArray(parsed.exercises)) {
      return null
    }
    return {
      selectedId: parsed.selectedId ?? null,
      meta: parsed.meta,
      exercises: parsed.exercises,
      isDirty: Boolean(parsed.isDirty),
      isNew: Boolean(parsed.isNew)
    }
  } catch {
    return null
  }
}

interface RowActionProps {
  title: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: React.ReactNode
}

const RowAction: React.FC<RowActionProps> = ({ title, onClick, disabled, danger, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
      danger
        ? 'bg-slate-800 hover:bg-rose-900/50 text-rose-300 border-slate-700'
        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
    }`}
  >
    {children}
  </button>
)

export const RoutineBuilderView: React.FC<RoutineBuilderViewProps> = ({
  routines,
  libraryExercises,
  libraryGroups,
  initialRoutineId,
  requestToken,
  onCreateRoutine,
  onUpdateRoutine,
  onDeleteRoutine
}) => {
  const [bootState] = useState(() => {
    const token = requestToken ?? 0
    const hasExplicitRequest = token > 0
    const persisted = loadPersistedDraft()

    // An explicit "Crear / Editar rutina" request from another view always wins
    if (hasExplicitRequest && !persisted?.isDirty) {
      const target = initialRoutineId ? routines.find(routine => routine.id === initialRoutineId) : null
      return { draft: target ? routineToDraft(target) : blankDraft(), processedToken: token }
    }

    // Restore unsaved work but still process the pending request afterwards
    if (persisted?.isDirty) {
      return { draft: persisted, processedToken: hasExplicitRequest ? token - 1 : token }
    }

    const initial = initialRoutineId ? routines.find(routine => routine.id === initialRoutineId) : null
    if (initial) return { draft: routineToDraft(initial), processedToken: token }

    if (persisted?.selectedId) {
      const persistedRoutine = routines.find(routine => routine.id === persisted.selectedId)
      if (persistedRoutine) return { draft: routineToDraft(persistedRoutine), processedToken: token }
    }

    return {
      draft: routines[0] ? routineToDraft(routines[0]) : blankDraft(),
      processedToken: token
    }
  })

  const [draft, setDraft] = useState<BuilderDraft>(bootState.draft)
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null)
  const [alternativePickerExerciseId, setAlternativePickerExerciseId] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const processedInitialRef = useRef<number>(bootState.processedToken)

  const loadDraft = useCallback((next: BuilderDraft) => {
    setDraft(next)
    setExpandedExerciseId(null)
  }, [])

  // Persist unsaved work so switching tabs doesn't lose the draft
  useEffect(() => {
    try {
      if (draft.isDirty) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      } else {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    } catch {
      // storage not available
    }
  }, [draft])

  // Auto-clear status messages
  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 5000)
    return () => clearTimeout(timer)
  }, [status])

  // Respond to "Crear / Editar rutina" requests coming from other views
  useEffect(() => {
    if (requestToken === undefined || processedInitialRef.current === requestToken) return
    processedInitialRef.current = requestToken

    const isPristine = draft.isNew && !draft.meta.title.trim() && draft.exercises.length === 0
    if (draft.isDirty && !isPristine && !confirm('Tienes cambios sin guardar. ¿Descartarlos?')) {
      return
    }

    const target = initialRoutineId ? routines.find(routine => routine.id === initialRoutineId) : null
    loadDraft(target ? routineToDraft(target) : blankDraft())
  }, [requestToken, initialRoutineId, routines, draft, loadDraft])

  // Keep selection in sync if the routine disappears elsewhere
  useEffect(() => {
    if (!draft.selectedId || draft.isNew) return
    if (routines.some(routine => routine.id === draft.selectedId)) return
    if (routines[0]) loadDraft(routineToDraft(routines[0]))
    else loadDraft(blankDraft())
  }, [routines, draft.selectedId, draft.isNew, loadDraft])

  const isPristineNewDraft = draft.isNew && !draft.meta.title.trim() && draft.exercises.length === 0

  const handleSelectRoutine = (routine: WorkoutDay) => {
    if (routine.id === draft.selectedId) return
    if (draft.isDirty && !draft.isNew && !confirm('Tienes cambios sin guardar. ¿Descartarlos?')) return
    loadDraft(routineToDraft(routine))
  }

  const handleNewRoutine = () => {
    if (draft.isDirty && !isPristineNewDraft && !confirm('Tienes cambios sin guardar. ¿Descartarlos?')) return
    loadDraft(blankDraft())
  }

  const handleMetaChange = (updates: Partial<RoutineMeta>) => {
    setDraft(prev => ({ ...prev, meta: { ...prev.meta, ...updates }, isDirty: true }))
  }

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setDraft(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      ),
      isDirty: true
    }))
  }

  const addBlankExercise = () => {
    const exercise: Exercise = { ...createBlankExercise(), id: 'ex_' + Date.now() }
    setDraft(prev => ({ ...prev, exercises: [...prev.exercises, exercise], isDirty: true }))
    setExpandedExerciseId(exercise.id)
  }

  const addFromLibrary = (libraryExercise: LibraryExercise) => {
    const exercise: Exercise = {
      id: `ex_lib_${libraryExercise.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: libraryExercise.name,
      targetMuscles: libraryExercise.muscleGroup,
      defaultSets: 3,
      repRange: '10-12',
      restSeconds: 60,
      restText: '60 s',
      alternative: 'Máquina disponible',
      objective: 'Hipertrofia',
      defaultVideoUrl: libraryExercise.url,
      techniqueCues: [
        'Controlar el rango completo de movimiento',
        'Fase excéntrica de 2-3 segundos'
      ]
    }
    setDraft(prev => ({ ...prev, exercises: [...prev.exercises, exercise], isDirty: true }))
  }

  const applyAlternativeFromLibrary = (libraryExercise: LibraryExercise) => {
    if (!alternativePickerExerciseId) return
    updateExercise(alternativePickerExerciseId, {
      alternative: libraryExercise.name,
      alternativeVideoUrl: libraryExercise.url
    })
    setAlternativePickerExerciseId(null)
  }

  const removeExercise = (exerciseId: string) => {
    setDraft(prev => ({
      ...prev,
      exercises: prev.exercises.filter(exercise => exercise.id !== exerciseId),
      isDirty: true
    }))
    if (expandedExerciseId === exerciseId) setExpandedExerciseId(null)
  }

  const duplicateExercise = (exerciseId: string) => {
    setDraft(prev => {
      const index = prev.exercises.findIndex(exercise => exercise.id === exerciseId)
      if (index === -1) return prev
      const copy: Exercise = {
        ...prev.exercises[index],
        id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      }
      const exercises = [...prev.exercises]
      exercises.splice(index + 1, 0, copy)
      return { ...prev, exercises, isDirty: true }
    })
  }

  const moveExercise = (exerciseId: string, direction: -1 | 1) => {
    setDraft(prev => {
      const index = prev.exercises.findIndex(exercise => exercise.id === exerciseId)
      const target = index + direction
      if (index === -1 || target < 0 || target >= prev.exercises.length) return prev
      const exercises = [...prev.exercises]
      const [moved] = exercises.splice(index, 1)
      exercises.splice(target, 0, moved)
      return { ...prev, exercises, isDirty: true }
    })
  }

  const handleSave = () => {
    const title = draft.meta.title.trim()
    if (!title) {
      setStatus({ type: 'error', message: 'Ponle un título a la rutina antes de guardar.' })
      return
    }

    const routine: WorkoutDay = {
      id: draft.selectedId || 'routine_' + Date.now(),
      dayName: draft.meta.dayName.trim() || 'Día',
      title,
      tagline: draft.meta.tagline.trim() || 'Entrenamiento personalizado',
      banner: draft.meta.banner,
      accentColor: draft.meta.accentColor,
      exercises: cloneExercises(draft.exercises)
    }

    if (draft.selectedId) onUpdateRoutine(routine)
    else onCreateRoutine(routine)

    setDraft(routineToDraft(routine))
    setStatus({
      type: 'success',
      message: draft.selectedId ? `Rutina "${routine.title}" actualizada.` : `Rutina "${routine.title}" creada.`
    })
  }

  const handleDelete = () => {
    if (!draft.selectedId) return
    if (!confirm('¿Eliminar esta rutina por completo?')) return

    const remaining = routines.filter(routine => routine.id !== draft.selectedId)
    const deletedTitle = draft.meta.title
    onDeleteRoutine(draft.selectedId)
    loadDraft(remaining[0] ? routineToDraft(remaining[0]) : blankDraft())
    setStatus({ type: 'success', message: `Rutina "${deletedTitle}" eliminada.` })
  }

  const handleDiscard = () => {
    if (!draft.isDirty) return
    if (!confirm('¿Descartar los cambios sin guardar?')) return

    if (draft.selectedId) {
      const original = routines.find(routine => routine.id === draft.selectedId)
      loadDraft(original ? routineToDraft(original) : blankDraft())
    } else {
      loadDraft(blankDraft())
    }
  }

  const canSave = draft.isDirty || draft.isNew

  return (
    <>
    <div className="space-y-4 pb-24 lg:pb-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Constructor de Rutinas
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">Diseña los planes de entrenamiento</h2>
          <p className="text-xs text-slate-400">
            Selecciona una rutina, arma la lista de ejercicios desde la librería y guarda los cambios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewRoutine}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-black border border-slate-700/80 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Rutina</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Rutina</span>
          </button>
        </div>
      </div>

      {/* Status message */}
      {status && (
        <div
          className={`p-3 rounded-2xl border text-xs font-bold flex items-start gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {status.type === 'success'
            ? <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_380px] gap-4 items-start">
        {/* LEFT: Routines list */}
        <section className="glass-panel rounded-3xl border border-slate-800 p-3 space-y-1.5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Rutinas ({routines.length})
            </span>
          </div>

          {draft.isNew && (
            <div className="p-3 rounded-2xl border bg-amber-500/10 border-amber-500/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Borrador sin guardar
              </span>
              <p className="text-xs font-black text-white truncate mt-0.5">
                {draft.meta.title || 'Nueva rutina'}
              </p>
              <p className="text-[10px] text-slate-400">{draft.exercises.length} ejercicios</p>
            </div>
          )}

          {routines.map(routine => {
            const isSelected = routine.id === draft.selectedId
            return (
              <button
                key={routine.id}
                onClick={() => handleSelectRoutine(routine)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    {routine.dayName}
                  </span>
                  {isSelected && draft.isDirty && (
                    <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded">
                      Editando
                    </span>
                  )}
                </div>
                <p className="text-xs font-black text-white truncate mt-0.5">{routine.title}</p>
                <p className="text-[10px] text-slate-400 truncate">
                  {routine.exercises.length} ejercicios • {routine.tagline}
                </p>
              </button>
            )
          })}

          {routines.length === 0 && !draft.isNew && (
            <p className="text-[11px] text-slate-500 italic text-center py-6 bg-slate-950 rounded-2xl border border-slate-800">
              No hay rutinas creadas todavía.
            </p>
          )}

          <button
            onClick={handleNewRoutine}
            className="w-full mt-1 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 text-xs font-black border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Rutina</span>
          </button>
        </section>

        {/* CENTER: Editor */}
        <section className="space-y-4 min-w-0">
          {/* Routine meta */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {draft.isNew ? 'Nueva Rutina' : 'Datos de la Rutina'}
                </h3>
              </div>
              {draft.isDirty && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                  Cambios sin guardar
                </span>
              )}
            </div>

            <RoutineMetaFields value={draft.meta} onChange={handleMetaChange} showBannerPreview />
          </div>

          {/* Exercises */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Ejercicios ({draft.exercises.length})
                </h3>
              </div>
              <button
                onClick={addBlankExercise}
                className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-black border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ejercicio manual</span>
              </button>
            </div>

            {draft.exercises.length === 0 ? (
              <div className="py-10 px-4 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                <p className="text-xs text-slate-500">
                  Esta rutina no tiene ejercicios todavía. Añádelos desde la librería o crea uno manual.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {draft.exercises.map((exercise, index) => {
                  const isExpanded = expandedExerciseId === exercise.id
                  return (
                    <div
                      key={exercise.id}
                      className={`rounded-2xl border transition-all ${
                        isExpanded
                          ? 'border-amber-500/40 bg-amber-500/5'
                          : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 p-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-black text-slate-300 flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>

                        <button
                          onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className={`text-xs font-black truncate ${exercise.name.trim() ? 'text-white' : 'text-slate-500 italic'}`}>
                            {exercise.name.trim() || 'Sin nombre'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {exercise.targetMuscles} • {exercise.defaultSets}×{exercise.repRange} • {exercise.restText}
                            {exercise.alternative ? ` • Alt: ${exercise.alternative}` : ''}
                          </p>
                        </button>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <RowAction
                            title="Subir"
                            disabled={index === 0}
                            onClick={() => moveExercise(exercise.id, -1)}
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </RowAction>
                          <RowAction
                            title="Bajar"
                            disabled={index === draft.exercises.length - 1}
                            onClick={() => moveExercise(exercise.id, 1)}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </RowAction>
                          <RowAction title="Duplicar" onClick={() => duplicateExercise(exercise.id)}>
                            <Copy className="w-3.5 h-3.5" />
                          </RowAction>
                          <RowAction title="Eliminar" danger onClick={() => removeExercise(exercise.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </RowAction>
                          <button
                            type="button"
                            onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                            title={isExpanded ? 'Cerrar editor' : 'Editar ejercicio'}
                            className={`p-2 rounded-xl border transition-all ${
                              isExpanded
                                ? 'bg-amber-500 text-slate-950 border-amber-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3 pb-4 pt-3 border-t border-slate-800/70 space-y-3">
                          <ExerciseFields
                            value={exercise}
                            onChange={updates => updateExercise(exercise.id, updates)}
                            autoFocusName={!exercise.name.trim()}
                            onPickAlternative={() => setAlternativePickerExerciseId(exercise.id)}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-slate-800">
              <div>
                {!draft.isNew && draft.selectedId && (
                  <button
                    onClick={handleDelete}
                    className="px-3.5 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-bold border border-rose-800/40 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar rutina</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                <button
                  onClick={handleDiscard}
                  disabled={!draft.isDirty}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Descartar cambios</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Rutina</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Exercise library */}
        <aside className="glass-panel rounded-3xl border border-slate-800 p-4 lg:col-span-2 xl:col-span-1 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Librería de Ejercicios
            </h3>
            <span className="ml-auto text-[10px] font-bold text-slate-500">{libraryExercises.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Haz clic en "Añadir" para sumar el ejercicio a la rutina.
          </p>

          <ExerciseLibraryList
            exercises={libraryExercises}
            groups={libraryGroups}
            onAdd={addFromLibrary}
            maxVisible={200}
          />
        </aside>
      </div>
    </div>

    <ExerciseLibraryPicker
      isOpen={!!alternativePickerExerciseId}
      onClose={() => setAlternativePickerExerciseId(null)}
      onAddExercise={applyAlternativeFromLibrary}
    />
    </>
  )
}
