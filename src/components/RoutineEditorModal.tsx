import React, { useState, useEffect } from 'react'
import { X, Calendar, Plus, Trash2, Edit3, Save } from 'lucide-react'
import type { WorkoutDay, Exercise } from '../types/workout'
import { ExerciseEditorModal } from './ExerciseEditorModal'

interface RoutineEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveRoutine: (routine: WorkoutDay) => void
  onDeleteRoutine?: (routineId: string) => void
  routineToEdit?: WorkoutDay | null
}

const AVAILABLE_BANNERS = [
  { id: '/assets/banner_leg_day.jpg', label: 'Pierna / Fuerza (Verde)' },
  { id: '/assets/banner_upper_body.jpg', label: 'Torso / Empuje-Tirón (Cyan)' },
  { id: '/assets/banner_full_body.jpg', label: 'Full Body (Púrpura)' },
  { id: '/assets/banner_rugby_conditioning.jpg', label: 'Rugby / Potencia (Ámbar)' }
]

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveRoutine,
  onDeleteRoutine,
  routineToEdit
}) => {
  const [dayName, setDayName] = useState('Lunes')
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [banner, setBanner] = useState('/assets/banner_leg_day.jpg')
  const [accentColor, setAccentColor] = useState<'emerald' | 'amber' | 'cyan' | 'purple'>('emerald')
  const [exercises, setExercises] = useState<Exercise[]>([])

  // Nested exercise editor
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false)
  const [selectedExerciseToEdit, setSelectedExerciseToEdit] = useState<Exercise | null>(null)

  useEffect(() => {
    if (routineToEdit) {
      setDayName(routineToEdit.dayName)
      setTitle(routineToEdit.title)
      setTagline(routineToEdit.tagline)
      setBanner(routineToEdit.banner)
      setAccentColor(routineToEdit.accentColor)
      setExercises(routineToEdit.exercises)
    } else {
      setDayName('Sábado')
      setTitle('Brazos, Hombros & Core')
      setTagline('Hipertrofia & Fuerza')
      setBanner('/assets/banner_upper_body.jpg')
      setAccentColor('cyan')
      setExercises([])
    }
  }, [routineToEdit, isOpen])

  if (!isOpen) return null

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newOrUpdatedRoutine: WorkoutDay = {
      id: routineToEdit ? routineToEdit.id : 'routine_' + Date.now(),
      dayName: dayName.trim() || 'Día',
      title: title.trim(),
      tagline: tagline.trim() || 'Entrenamiento personalizado',
      banner,
      accentColor,
      exercises
    }

    onSaveRoutine(newOrUpdatedRoutine)
    onClose()
  }

  const handleSaveExercise = (exercise: Exercise) => {
    if (selectedExerciseToEdit) {
      setExercises(prev => prev.map(e => e.id === exercise.id ? exercise : e))
    } else {
      setExercises(prev => [...prev, exercise])
    }
    setSelectedExerciseToEdit(null)
  }

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(e => e.id !== exerciseId))
  }

  const handleOpenAddExercise = () => {
    setSelectedExerciseToEdit(null)
    setExerciseModalOpen(true)
  }

  const handleOpenEditExercise = (ex: Exercise) => {
    setSelectedExerciseToEdit(ex)
    setExerciseModalOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-[#0d1424] border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-slate-100 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {routineToEdit ? 'Editar Rutina' : 'Crear Nueva Rutina'}
                </h3>
                <p className="text-[11px] text-slate-400">Personaliza el día, nombre y lista de ejercicios</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveRoutine} className="space-y-3.5 mt-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Día / Etiqueta
                </label>
                <input
                  type="text"
                  placeholder="ej. Sábado"
                  value={dayName}
                  onChange={e => setDayName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Título de la Rutina *
                </label>
                <input
                  type="text"
                  placeholder="ej. Piernas, Glúteos & Core"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Subtítulo / Objetivo
              </label>
              <input
                type="text"
                placeholder="ej. Fuerza + Hipertrofia"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Banner Visual
                </label>
                <select
                  value={banner}
                  onChange={e => setBanner(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {AVAILABLE_BANNERS.map(b => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Color de Acento
                </label>
                <select
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value as any)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="emerald">Verde Esmeralda</option>
                  <option value="cyan">Cyan Eléctrico</option>
                  <option value="amber">Ámbar Fuego</option>
                  <option value="purple">Púrpura Neón</option>
                </select>
              </div>
            </div>

            {/* Exercises in Routine List */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ejercicios ({exercises.length})
                </span>
                <button
                  type="button"
                  onClick={handleOpenAddExercise}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Ejercicio</span>
                </button>
              </div>

              {exercises.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic text-center py-3 bg-slate-950 rounded-xl border border-slate-800">
                  No hay ejercicios en esta rutina todavía. Toca "+ Agregar Ejercicio".
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-[10px] font-bold text-slate-500">#{idx + 1}</span>
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{ex.name}</p>
                          <p className="text-[10px] text-slate-400">{ex.defaultSets} series × {ex.repRange} • {ex.restText}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditExercise(ex)}
                          className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Editar ejercicio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Eliminar ejercicio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {routineToEdit && onDeleteRoutine && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Eliminar esta rutina por completo?')) {
                      onDeleteRoutine(routineToEdit.id)
                      onClose()
                    }
                  }}
                  className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-bold rounded-xl border border-rose-800/40 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Rutina</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Nested Exercise Editor */}
      <ExerciseEditorModal
        isOpen={exerciseModalOpen}
        onClose={() => {
          setExerciseModalOpen(false)
          setSelectedExerciseToEdit(null)
        }}
        onSaveExercise={handleSaveExercise}
        exerciseToEdit={selectedExerciseToEdit}
      />
    </>
  )
}
