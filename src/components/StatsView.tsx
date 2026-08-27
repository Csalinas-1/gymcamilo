import React, { useState } from 'react'
import { Trophy, Calendar, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import type { PersonalRecord, WorkoutSession } from '../types/workout'

interface StatsViewProps {
  prs: Record<string, PersonalRecord>
  history: WorkoutSession[]
  onOpenPlateCalculator: (weight?: number) => void
}

export const StatsView: React.FC<StatsViewProps> = ({
  prs,
  history,
  onOpenPlateCalculator
}) => {
  const [calcWeight, setCalcWeight] = useState<number>(100)
  const [calcReps, setCalcReps] = useState<number>(5)
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  // 1RM Calculation (Epley formula: w * (1 + r/30))
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30))

  const prList = Object.values(prs)
  const finishedHistory = history.filter(h => h.isFinished)

  const toggleExpandSession = (sessionId: string) => {
    setExpandedSessionId(prev => (prev === sessionId ? null : sessionId))
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '—'
    const m = Math.floor(seconds / 60)
    return `${m} min`
  }

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      {/* Trophy Room Header */}
      <div className="glass-card rounded-3xl p-5 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Sala de Trofeos & PRs</h2>
            <p className="text-xs text-slate-400">Tus mejores levantamientos y marcas personales</p>
          </div>
        </div>

        {prList.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              ¡Aún no hay récords registrados! Completa tu primer entrenamiento para desbloquear tus trofeos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {prList.map(pr => (
              <div
                key={pr.exerciseId}
                className="p-3.5 rounded-2xl bg-[#0b101d] border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-white">{pr.exerciseName}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-black text-amber-400 font-mono">
                      {pr.maxWeight} kg
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      × {pr.repsAtMaxWeight} reps
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">1RM Est.</span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    ~{pr.estimated1RM} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive 1RM Estimator Tool */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">Calculadora Rápida 1RM</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Peso Levantado (kg)</label>
            <input
              type="number"
              value={calcWeight}
              onChange={e => setCalcWeight(Number(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-black text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Repeticiones Hechas</label>
            <input
              type="number"
              value={calcReps}
              onChange={e => setCalcReps(Number(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-black text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* 1RM Output */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-cyan-400">1 Repetición Máxima Estimada:</span>
            <p className="text-xl font-black text-white font-mono">{estimated1RM} kg</p>
          </div>
          <button
            onClick={() => onOpenPlateCalculator(estimated1RM)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all"
          >
            Ver Discos
          </button>
        </div>

        {/* Rep breakdown table */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 text-center text-xs font-mono">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">3RM</span>
            <span className="font-bold text-slate-200">{Math.round(estimated1RM * 0.93)}kg</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">5RM</span>
            <span className="font-bold text-slate-200">{Math.round(estimated1RM * 0.87)}kg</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">8RM</span>
            <span className="font-bold text-slate-200">{Math.round(estimated1RM * 0.80)}kg</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">10RM</span>
            <span className="font-bold text-slate-200">{Math.round(estimated1RM * 0.75)}kg</span>
          </div>
        </div>
      </div>

      {/* Workout History Log Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Historial de Sesiones ({finishedHistory.length})
          </h3>
          <span className="text-[11px] text-slate-500">Últimos entrenamientos</span>
        </div>

        {finishedHistory.length === 0 ? (
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Aún no hay historial guardado.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {finishedHistory.map(session => {
              const isExpanded = expandedSessionId === session.id
              const sessionDate = new Date(session.startedAt).toLocaleDateString('es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })

              return (
                <div
                  key={session.id}
                  className="rounded-2xl bg-[#0e1526] border border-slate-800 overflow-hidden transition-all shadow-md"
                >
                  <div
                    onClick={() => toggleExpandSession(session.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                          {session.dayName}
                        </span>
                        <span className="text-xs font-bold text-white">{session.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        📅 {sessionDate} • ⏱️ {formatDuration(session.durationSeconds)} • 🏋️ {session.totalVolumeKg || 0} kg total
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Session Exercise Sets Breakdown */}
                  {isExpanded && (
                    <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 space-y-2 text-xs">
                      {Object.values(session.logs).map((ex, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                          <p className="font-bold text-white mb-1">{ex.activeName}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ex.sets.filter(s => s.completed).map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300"
                              >
                                S{s.setNumber}: {s.weight}k × {s.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
