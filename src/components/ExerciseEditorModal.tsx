import React, { useState, useEffect } from 'react'
import { X, Dumbbell, Save, Plus } from 'lucide-react'
import type { Exercise } from '../types/workout'

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
  const [name, setName] = useState('')
  const [targetMuscles, setTargetMuscles] = useState('')
  const [defaultSets, setDefaultSets] = useState(3)
  const [repRange, setRepRange] = useState('10-12')
  const [restSeconds, setRestSeconds] = useState(60)
  const [alternative, setAlternative] = useState('')
  const [objective, setObjective] = useState('Hipertrofia')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (exerciseToEdit) {
      setName(exerciseToEdit.name)
      setTargetMuscles(exerciseToEdit.targetMuscles)
      setDefaultSets(exerciseToEdit.defaultSets)
      setRepRange(exerciseToEdit.repRange)
      setRestSeconds(exerciseToEdit.restSeconds)
      setAlternative(exerciseToEdit.alternative || '')
      setObjective(exerciseToEdit.objective || 'Hipertrofia')
      setVideoUrl(exerciseToEdit.defaultVideoUrl || '')
    } else {
      setName('')
      setTargetMuscles('Piernas / Torso')
      setDefaultSets(3)
      setRepRange('10-12')
      setRestSeconds(60)
      setAlternative('Mancuernas / Polea')
      setObjective('Hipertrofia')
      setVideoUrl('')
    }
  }, [exerciseToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const exercise: Exercise = {
      id: exerciseToEdit ? exerciseToEdit.id : 'ex_' + Date.now(),
      name: name.trim(),
      targetMuscles: targetMuscles.trim() || 'General',
      defaultSets: Number(defaultSets) || 3,
      repRange: repRange.trim() || '10-12',
      restSeconds: Number(restSeconds) || 60,
      restText: `${restSeconds} s`,
      alternative: alternative.trim() || 'Máquina disponible',
      objective: objective.trim() || 'Fuerza + masa',
      defaultVideoUrl: videoUrl.trim() || undefined,
      techniqueCues: exerciseToEdit?.techniqueCues || [
        'Mantener buena postura y control en todo el rango de movimiento',
        'Fase excéntrica controlada'
      ]
    }

    onSaveExercise(exercise)
    onClose()
  }

  return (
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
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Nombre del Ejercicio *
            </label>
            <input
              type="text"
              placeholder="ej. Prensa 45°, Press Militar, Hip Thrust..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Zona / Músculos
              </label>
              <input
                type="text"
                placeholder="ej. Cuádriceps, glúteos"
                value={targetMuscles}
                onChange={e => setTargetMuscles(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Objetivo
              </label>
              <input
                type="text"
                placeholder="ej. Fuerza + masa"
                value={objective}
                onChange={e => setObjective(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Series
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={defaultSets}
                onChange={e => setDefaultSets(Number(e.target.value))}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Reps / Tiempo
              </label>
              <input
                type="text"
                placeholder="10-12"
                value={repRange}
                onChange={e => setRepRange(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Descanso (seg)
              </label>
              <select
                value={restSeconds}
                onChange={e => setRestSeconds(Number(e.target.value))}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-white font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="0">0 s (Cardio)</option>
                <option value="30">30 s</option>
                <option value="45">45 s</option>
                <option value="60">60 s</option>
                <option value="75">75 s</option>
                <option value="90">90 s</option>
                <option value="120">120 s</option>
                <option value="180">180 s</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Máquina / Ejercicio Alternativo
            </label>
            <input
              type="text"
              placeholder="ej. Hack squat / Smith, Polea, Mancuernas..."
              value={alternative}
              onChange={e => setAlternative(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              URL Video YouTube de Técnica (Opcional)
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

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
  )
}
