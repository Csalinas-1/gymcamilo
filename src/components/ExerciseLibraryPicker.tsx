import React, { useEffect, useState } from 'react'
import { X, BookOpen } from 'lucide-react'
import type { LibraryExercise } from '../types/workout'
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '../data/exerciseLibrary'
import { ExerciseLibraryList } from './routine/ExerciseLibraryList'

interface ExerciseLibraryPickerProps {
  isOpen: boolean
  onClose: () => void
  onAddExercise: (exercise: LibraryExercise) => void
}

const MAX_VISIBLE = 250

export const ExerciseLibraryPicker: React.FC<ExerciseLibraryPickerProps> = ({
  isOpen,
  onClose,
  onAddExercise
}) => {
  const [added, setAdded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      setAdded({})
    }
  }, [isOpen])

  if (!isOpen) return null

  const addedCount = Object.keys(added).length

  const handleAdd = (exercise: LibraryExercise) => {
    if (added[exercise.id]) return
    onAddExercise(exercise)
    setAdded(prev => ({ ...prev, [exercise.id]: true }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#0d1424] border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Librería de Ejercicios</h3>
              <p className="text-[11px] text-slate-400">
                {EXERCISE_LIBRARY.length} ejercicios agrupados por zona muscular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search, Filters & Results */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <ExerciseLibraryList
            exercises={EXERCISE_LIBRARY}
            groups={MUSCLE_GROUPS}
            onAdd={handleAdd}
            isAdded={exercise => !!added[exercise.id]}
            maxVisible={MAX_VISIBLE}
            autoFocusSearch
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800 bg-[#0b101c] flex-shrink-0">
          <span className="text-xs text-slate-400">
            {addedCount > 0 ? `${addedCount} ejercicio(s) agregado(s) a la rutina` : 'Toca "Añadir" para sumar a la rutina'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  )
}
