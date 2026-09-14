import React, { useMemo, useRef, useState } from 'react'
import { Search, ExternalLink, Plus, Check } from 'lucide-react'
import type { LibraryExercise, MuscleGroup, MuscleGroupMeta } from '../../types/workout'
import { getMuscleAccent } from '../../utils/muscleAccents'

interface ExerciseLibraryListProps {
  exercises: LibraryExercise[]
  groups: MuscleGroupMeta[]
  onAdd: (exercise: LibraryExercise) => void
  isAdded?: (exercise: LibraryExercise) => boolean
  maxVisible?: number
  autoFocusSearch?: boolean
}

export const ExerciseLibraryList: React.FC<ExerciseLibraryListProps> = ({
  exercises,
  groups,
  onAdd,
  isAdded,
  maxVisible = 250,
  autoFocusSearch = false
}) => {
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<MuscleGroup | 'Todas'>('Todas')
  const [flash, setFlash] = useState<Record<string, boolean>>({})
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return exercises.filter(exercise => {
      const matchesGroup = activeGroup === 'Todas' || exercise.muscleGroup === activeGroup
      const matchesTerm = !term || exercise.name.toLowerCase().includes(term)
      return matchesGroup && matchesTerm
    })
  }, [exercises, search, activeGroup])

  const visible = filtered.slice(0, maxVisible)

  const handleAdd = (exercise: LibraryExercise) => {
    if (isAdded?.(exercise) || flash[exercise.id]) return
    onAdd(exercise)
    setFlash(prev => ({ ...prev, [exercise.id]: true }))
    if (timersRef.current[exercise.id]) clearTimeout(timersRef.current[exercise.id])
    timersRef.current[exercise.id] = setTimeout(() => {
      setFlash(prev => {
        const next = { ...prev }
        delete next[exercise.id]
        return next
      })
      delete timersRef.current[exercise.id]
    }, 1500)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar ejercicio por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
          autoFocus={autoFocusSearch}
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
          Todas ({exercises.length})
        </button>

        {groups.map(group => {
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

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
        <span>{filtered.length} ejercicios encontrados</span>
        {filtered.length > maxVisible && (
          <span>Mostrando {maxVisible}. Afina la búsqueda.</span>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-xs text-slate-500 py-10 bg-slate-950/60 rounded-2xl border border-slate-800">
          No se encontraron ejercicios para "{search}".
        </p>
      ) : (
        <div className="space-y-1.5">
          {visible.map(exercise => {
            const group = groups.find(g => g.id === exercise.muscleGroup)
            const accent = getMuscleAccent(group?.accent)
            const added = !!isAdded?.(exercise)
            const isFlash = !!flash[exercise.id]
            const showAdded = added || isFlash

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
                    disabled={showAdded}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-black border flex items-center gap-1 transition-all ${
                      showAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 active:scale-95'
                    }`}
                  >
                    {showAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{showAdded ? 'Añadido' : 'Añadir'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
