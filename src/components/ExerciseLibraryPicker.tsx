import React, { useEffect, useMemo, useState } from 'react'
import { X, Search, ExternalLink, Plus, Check, BookOpen } from 'lucide-react'
import type { LibraryExercise, MuscleGroup } from '../types/workout'
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '../data/exerciseLibrary'
import { getMuscleAccent } from '../utils/muscleAccents'

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
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<MuscleGroup | 'Todas'>('Todas')
  const [added, setAdded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      setAdded({})
      setSearch('')
      setActiveGroup('Todas')
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return EXERCISE_LIBRARY.filter(exercise => {
      const matchesGroup = activeGroup === 'Todas' || exercise.muscleGroup === activeGroup
      const matchesTerm = !term || exercise.name.toLowerCase().includes(term)
      return matchesGroup && matchesTerm
    })
  }, [search, activeGroup])

  if (!isOpen) return null

  const visible = filtered.slice(0, MAX_VISIBLE)
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

        {/* Search & Filters */}
        <div className="px-5 py-3 border-b border-slate-800 space-y-3 flex-shrink-0 bg-[#0b101c]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ejercicio por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setActiveGroup('Todas')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                activeGroup === 'Todas'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Todas ({EXERCISE_LIBRARY.length})
            </button>

            {MUSCLE_GROUPS.map(group => {
              const accent = getMuscleAccent(group.accent)
              const isActive = activeGroup === group.id
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                    isActive ? accent.button : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {group.label} ({group.count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {visible.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-10">
              No se encontraron ejercicios para "{search}".
            </p>
          ) : (
            <div className="space-y-1.5">
              {visible.map(exercise => {
                const group = MUSCLE_GROUPS.find(g => g.id === exercise.muscleGroup)
                const accent = getMuscleAccent(group?.accent)
                const isAdded = !!added[exercise.id]

                return (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${accent.dot}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{exercise.name}</p>
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${accent.badge}`}>
                          {exercise.muscleGroup}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={exercise.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Ver ficha del ejercicio"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleAdd(exercise)}
                        disabled={isAdded}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-black border flex items-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 active:scale-95'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isAdded ? 'Añadido' : 'Añadir'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filtered.length > MAX_VISIBLE && (
            <p className="text-center text-[11px] text-slate-500 py-3">
              Mostrando {MAX_VISIBLE} de {filtered.length} resultados. Usa el buscador para afinar.
            </p>
          )}
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
