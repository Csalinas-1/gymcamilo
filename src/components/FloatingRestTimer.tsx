import React from 'react'
import { Timer, Plus, Minus, X, Maximize2, Minimize2, Check } from 'lucide-react'
import type { RestTimerState } from '../hooks/useWorkoutStore'

interface FloatingRestTimerProps {
  timer: RestTimerState
  onStop: () => void
  onAdjust: (delta: number) => void
  onToggleMinimize: () => void
}

export const FloatingRestTimer: React.FC<FloatingRestTimerProps> = ({
  timer,
  onStop,
  onAdjust,
  onToggleMinimize
}) => {
  if (!timer.isActive && timer.remainingSeconds <= 0) return null

  const progress = timer.totalSeconds > 0 
    ? (timer.remainingSeconds / timer.totalSeconds) * 100 
    : 0

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Minimized Floating Pill
  if (timer.isMinimized) {
    return (
      <aside aria-label="Temporizador de descanso minimizado" className="fixed bottom-20 right-4 z-50 animate-bounce">
        <div 
          onClick={onToggleMinimize}
          className="flex items-center space-x-2.5 bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-full shadow-xl shadow-amber-500/30 border border-amber-300 cursor-pointer active:scale-95 transition-all"
        >
          <Timer className="w-4 h-4 animate-spin text-slate-950" style={{ animationDuration: '3s' }} />
          <span className="text-sm font-extrabold font-mono tracking-wider">{formatTime(timer.remainingSeconds)}</span>
          <Maximize2 className="w-3.5 h-3.5 opacity-80" />
        </div>
      </aside>
    )
  }

  // Expanded Rest Timer Overlay Modal / Floating Card
  const circumference = 2 * Math.PI * 48
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <aside aria-label="Temporizador de descanso en vivo" className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 transition-all duration-300">
      <div className="glass-panel bg-[#0d1424]/95 border-2 border-amber-500/50 rounded-3xl p-4.5 shadow-2xl shadow-amber-500/20 backdrop-blur-2xl">
        {/* Header with Title and Minimize/Close */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Descanso en Progreso</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onToggleMinimize}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Minimizar"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onStop}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Saltar descanso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Exercise name subtitle */}
        <p className="text-xs font-semibold text-slate-300 truncate mb-3 text-center">
          {timer.exerciseName || 'Siguiente serie'}
        </p>

        {/* Circular Progress & Huge Digital Countdown */}
        <div className="flex items-center justify-center relative my-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="text-slate-800 stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="text-amber-400 stroke-current transition-all duration-300"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono tracking-tight text-white drop-shadow-md">
                {formatTime(timer.remainingSeconds)}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-widest">
                Segundos
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stepper Adjust Buttons (+30s, -15s, Skip) */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => onAdjust(-15)}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold border border-slate-700/60 transition-all"
          >
            <Minus className="w-3.5 h-3.5 text-amber-400" />
            <span>15s</span>
          </button>

          <button
            onClick={() => onAdjust(30)}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold border border-slate-700/60 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>30s</span>
          </button>

          <button
            onClick={onStop}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Listo</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
