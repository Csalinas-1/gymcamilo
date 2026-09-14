import React, { useState, useEffect } from 'react'
import { 
  Check, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Clock, 
  Flag, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { WorkoutSession, WorkoutDay } from '../types/workout'

interface ActiveWorkoutViewProps {
  activeSession: WorkoutSession
  routines: WorkoutDay[]
  onUpdateSet: (exerciseId: string, setIndex: number, field: 'weight' | 'reps' | 'rpe' | 'completed', value: any) => void
  onAddSet: (exerciseId: string) => void
  onRemoveSet: (exerciseId: string, setIndex: number) => void
  onToggleAlternative: (exerciseId: string) => void
  onUpdateNotes: (exerciseId: string, notes: string) => void
  onFinishWorkout: () => void
  onCancelWorkout: () => void
  onOpenExerciseModal: (exercise: any) => void
  onOpenPlateCalculator: (weight?: number) => void
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  activeSession,
  routines,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onToggleAlternative,
  onFinishWorkout,
  onCancelWorkout,
  onOpenExerciseModal,
  onOpenPlateCalculator
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [collapsedExercises, setCollapsedExercises] = useState<Record<string, boolean>>({})

  // Find the day definition
  const currentDayDef = routines.find(r => r.id === activeSession.dayId)

  // Workout Elapsed Timer
  useEffect(() => {
    const startTime = new Date(activeSession.startedAt).getTime()
    const updateElapsed = () => {
      const now = Date.now()
      setElapsedSeconds(Math.floor((now - startTime) / 1000))
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    return () => clearInterval(interval)
  }, [activeSession.startedAt])

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  const toggleCollapse = (exerciseId: string) => {
    setCollapsedExercises(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }))
  }

  let totalSetsCount = 0
  let completedSetsCount = 0

  Object.values(activeSession.logs).forEach(ex => {
    ex.sets.forEach(s => {
      totalSetsCount++
      if (s.completed) {
        completedSetsCount++
      }
    })
  })

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-300 lg:max-w-5xl lg:mx-auto lg:pb-4">
      {/* Session Active Top Bar */}
      <div className="sticky top-14 lg:top-0 z-30 bg-[#090d16]/95 backdrop-blur-xl -mx-4 px-4 lg:-mx-8 lg:px-8 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              {activeSession.dayName} • {activeSession.title}
            </span>
          </div>
          <div className="flex items-center space-x-3 mt-0.5">
            <div className="flex items-center space-x-1 text-slate-300 font-mono text-sm font-black">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatElapsed(elapsedSeconds)}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold text-slate-400">
              {completedSetsCount}/{totalSetsCount} Series
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all border border-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={onFinishWorkout}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5 fill-slate-950" />
            <span>Finalizar</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${totalSetsCount > 0 ? (completedSetsCount / totalSetsCount) * 100 : 0}%` }}
        ></div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {currentDayDef?.exercises.map((exDef, exIndex) => {
          const exLog = activeSession.logs[exDef.id]
          if (!exLog) return null

          const isCollapsed = !!collapsedExercises[exDef.id]
          const isAllCompleted = exLog.sets.length > 0 && exLog.sets.every(s => s.completed)

          return (
            <div
              key={exDef.id}
              className={`rounded-3xl border transition-all duration-200 ${
                isAllCompleted
                  ? 'bg-[#0b1422] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-[#0f172a]/90 border-slate-800 shadow-md'
              }`}
            >
              {/* Exercise Header */}
              <div className="p-4 border-b border-slate-800/80">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        #{exIndex + 1}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {exDef.targetMuscles}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        ⏱️ {exDef.restText}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white mt-1 flex items-center gap-1.5">
                      <span>{exLog.activeName}</span>
                      {isAllCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                    </h3>
                  </div>

                  {/* Top Right Tool Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onOpenPlateCalculator(Number(exLog.sets[0]?.weight) || 100)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700/60 transition-all"
                      title="Calculadora de Discos"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenExerciseModal(exDef)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
                      title="Ver técnica e hipervínculos"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleCollapse(exDef.id)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 transition-all"
                    >
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Alternative Toggle Button */}
                {exDef.alternative && (
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Dumbbell className="w-3 h-3 text-cyan-400" />
                      Alt: <strong className="text-slate-200">{exDef.alternative}</strong>
                    </span>

                    <button
                      onClick={() => onToggleAlternative(exDef.id)}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-all ${
                        exLog.isAlternativeSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {exLog.isAlternativeSelected ? '✓ Usando Alternativa' : 'Cambiar a Alt'}
                    </button>
                  </div>
                )}
              </div>

              {/* Sets Table & Inputs */}
              {!isCollapsed && (
                <div className="p-4 space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center px-1">
                    <div className="col-span-2 text-left">Serie</div>
                    <div className="col-span-3 text-slate-400">Previo</div>
                    <div className="col-span-3">KG</div>
                    <div className="col-span-2">Reps</div>
                    <div className="col-span-2">Check</div>
                  </div>

                  {/* Set Rows */}
                  <div className="space-y-2">
                    {exLog.sets.map((set, setIdx) => {
                      const isCompleted = set.completed

                      return (
                        <div
                          key={setIdx}
                          className={`grid grid-cols-12 gap-1.5 items-center p-2 rounded-2xl border transition-all ${
                            isCompleted
                              ? 'bg-emerald-500/15 border-emerald-500/40'
                              : 'bg-slate-900/80 border-slate-800'
                          }`}
                        >
                          <div className="col-span-2 font-black text-xs text-white pl-1 flex items-center space-x-1">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                              isCompleted ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {set.setNumber}
                            </span>
                          </div>

                          <div className="col-span-3 text-center">
                            <span className="text-[11px] font-mono font-medium text-slate-400 tracking-tight">
                              {set.previousWeight ? `${set.previousWeight}k × ${set.previousReps || exDef.repRange}` : `—`}
                            </span>
                          </div>

                          <div className="col-span-3 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                            <input
                              type="number"
                              placeholder={set.previousWeight ? String(set.previousWeight) : '0'}
                              value={set.weight}
                              onChange={e => onUpdateSet(exDef.id, setIdx, 'weight', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full text-center text-xs font-black font-mono text-white bg-transparent focus:outline-none focus:text-emerald-400"
                            />
                          </div>

                          <div className="col-span-2 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                            <input
                              type="number"
                              placeholder={exDef.repRange.split('-')[0] || '10'}
                              value={set.reps}
                              onChange={e => onUpdateSet(exDef.id, setIdx, 'reps', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full text-center text-xs font-black font-mono text-white bg-transparent focus:outline-none focus:text-emerald-400"
                            />
                          </div>

                          <div className="col-span-2 flex items-center justify-center">
                            <button
                              onClick={() => onUpdateSet(exDef.id, setIdx, 'completed', !set.completed)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-all ${
                                isCompleted
                                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                              }`}
                            >
                              <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-slate-950' : 'text-slate-500'}`} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Add / Remove Set Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onAddSet(exDef.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700/60 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Agregar Serie</span>
                    </button>

                    {exLog.sets.length > 1 && (
                      <button
                        onClick={() => onRemoveSet(exDef.id, exLog.sets.length - 1)}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 text-xs font-semibold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Big Finish Session Button */}
      <div className="pt-4">
        <button
          onClick={onFinishWorkout}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-black text-base flex items-center justify-center space-x-2 shadow-2xl shadow-amber-500/30 transition-all"
        >
          <Flag className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>TERMINAR Y GUARDAR ENTRENAMIENTO</span>
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-[#0d1424] border border-rose-500/40 rounded-3xl p-5 shadow-2xl text-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">¿Cancelar entrenamiento?</h3>
            <p className="text-xs text-slate-400 mt-1">Los datos de esta sesión no se guardarán en el historial.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Continuar
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  onCancelWorkout()
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
