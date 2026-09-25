import React, { useState, useEffect } from 'react'
import { X, Dumbbell, Save, Plus } from 'lucide-react'
import type { Exercise, LibraryExercise } from '../types/workout'
import { ExerciseFields } from './routine/ExerciseFields'
import { ExerciseLibraryPicker } from './ExerciseLibraryPicker'
import { createBlankExercise } from './routine/routineDefaults'

interface ExerciseEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveExercise: (exercise: Exercise) => void
  exerciseToEdit?: Exercise | null
}

export const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveExercise,
  exerciseToEdit
}) => {
  const [form, setForm] = useState<Exercise>(createBlankExercise)
  const [alternativePickerOpen, setAlternativePickerOpen] = useState(false)

  useEffect(() => {
    setForm(exerciseToEdit ? { ...createBlankExercise(), ...exerciseToEdit } : createBlankExercise())
    setAlternativePickerOpen(false)
  }, [exerciseToEdit, isOpen])

  if (!isOpen) return null

  const handleChange = (updates: Partial<Exercise>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    const restSeconds = Number(form.restSeconds)

    const exercise: Exercise = {
      ...form,
      id: exerciseToEdit ? exerciseToEdit.id : 'ex_' + Date.now(),
      name: form.name.trim(),
      targetMuscles: form.targetMuscles.trim() || 'General',
      defaultSets: Number(form.defaultSets) || 3,
      repRange: form.repRange.trim() || '10-12',
      restSeconds: Number.isFinite(restSeconds) ? restSeconds : 60,
      restText: `${restSeconds} s`,
      alternative: form.alternative.trim() || 'Máquina disponible',
      objective: form.objective.trim() || 'Fuerza + masa',
      defaultVideoUrl: form.defaultVideoUrl?.trim() || undefined,
      techniqueCues: form.techniqueCues?.length
        ? form.techniqueCues
        : [
            'Mantener buena postura y control en todo el rango de movimiento',
            'Fase excéntrica controlada'
          ]
    }

    onSaveExercise(exercise)
    onClose()
  }

  const handleAddAlternative = (libraryExercise: LibraryExercise) => {
    setForm(prev => ({
      ...prev,
      alternative: libraryExercise.name,
      alternativeVideoUrl: libraryExercise.url
    }))
    setAlternativePickerOpen(false)
  }

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1424] border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {exerciseToEdit ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
              </h3>
              <p className="text-[11px] text-slate-400">Personaliza series, reps, descanso y máquina alternativa</p>
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
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <ExerciseFields
            value={form}
            onChange={handleChange}
            autoFocusName={!exerciseToEdit}
            onPickAlternative={() => setAlternativePickerOpen(true)}
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              {exerciseToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{exerciseToEdit ? 'Guardar Cambios' : 'Agregar Ejercicio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <ExerciseLibraryPicker
      isOpen={alternativePickerOpen}
      onClose={() => setAlternativePickerOpen(false)}
      onAddExercise={handleAddAlternative}
    />
    </>
  )
}
