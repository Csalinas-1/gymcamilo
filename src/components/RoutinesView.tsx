import React, { useState } from 'react'
import { Play, Dumbbell, Info, Calculator, Plus, Edit3, RotateCcw } from 'lucide-react'
import type { WorkoutDay, Exercise } from '../types/workout'

interface RoutinesViewProps {
  routines: WorkoutDay[]
  selectedDayId?: string
  onStartWorkout: (dayId: string) => void
  onOpenExerciseModal: (exercise: Exercise) => void
  onOpenPlateCalculator: (weight?: number) => void
  selectedAlternatives: Record<string, boolean>
  onToggleAlternative: (exerciseId: string) => void
  onOpenCreateRoutine: () => void
  onOpenEditRoutine: (routine: WorkoutDay) => void
  onResetRoutines: () => void
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  routines,
  selectedDayId,
  onStartWorkout,
  onOpenExerciseModal,
  onOpenPlateCalculator,
  selectedAlternatives,
  onToggleAlternative,
  onOpenCreateRoutine,
  onOpenEditRoutine,
  onResetRoutines
}) => {
  const [activeDayId, setActiveDayId] = useState<string>(selectedDayId || routines[0]?.id || '')

  const currentDay = routines.find(r => r.id === activeDayId) || routines[0]

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* 5-Day Selector Pills & Add Routine button */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {routines.map(day => {
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

        <button
          onClick={onOpenCreateRoutine}
          className="flex-shrink-0 px-3 py-2 rounded-2xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700/80 flex items-center gap-1 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Rutina</span>
        </button>
      </div>

      {/* Routine Banner & Header */}
      {currentDay && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl relative">
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

            <div className="absolute top-3 right-3 flex items-center space-x-1">
              <button
                onClick={() => onOpenEditRoutine(currentDay)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 text-xs font-bold backdrop-blur-md border border-slate-700 shadow-lg flex items-center gap-1 active:scale-95 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Rutina</span>
              </button>
            </div>

            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/90 text-slate-950 px-2.5 py-0.5 rounded-full shadow">
                {currentDay.dayName}
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">{currentDay.title}</h2>
              <p className="text-xs text-slate-300 font-medium">{currentDay.tagline}</p>
            </div>
          </div>

          <div className="p-4 pt-2">
            <button
              onClick={() => onStartWorkout(currentDay.id)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>COMENZAR ESTE ENTRENAMIENTO</span>
            </button>
          </div>
        </div>
      )}

      {/* Exercise Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Lista de Ejercicios ({currentDay?.exercises.length || 0})
          </h3>
          {currentDay && (
            <button
              onClick={() => onOpenEditRoutine(currentDay)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar / Editar</span>
            </button>
          )}
        </div>

        {currentDay?.exercises.map((exercise, idx) => {
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

      {/* Reset to initial routines button */}
      <div className="pt-3 text-center">
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
    </div>
  )
}
