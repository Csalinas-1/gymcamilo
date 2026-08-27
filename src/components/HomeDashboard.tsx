import React from 'react'
import { Play, CheckCircle2, Circle, Flame, Dumbbell, Award, ArrowRight, Zap, Info, Plus } from 'lucide-react'
import type { WorkoutDay, WorkoutSession, PersonalRecord, UserProfile } from '../types/workout'

interface HomeDashboardProps {
  routines: WorkoutDay[]
  history: WorkoutSession[]
  prs: Record<string, PersonalRecord>
  activeSession: WorkoutSession | null
  activeProfile: UserProfile
  onStartWorkout: (dayId: string) => void
  onNavigateActive: () => void
  onSelectDay: (day: WorkoutDay) => void
  onOpenCreateRoutine: () => void
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  routines,
  history,
  prs,
  activeSession,
  activeProfile,
  onStartWorkout,
  onNavigateActive,
  onSelectDay,
  onOpenCreateRoutine
}) => {
  const dayIndex = new Date().getDay()
  const dayNamesMap: Record<number, string> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    0: 'Domingo'
  }

  const todayDayName = dayNamesMap[dayIndex] || 'Lunes'
  const suggestedRoutine = routines.find(r => r.dayName === todayDayName) || routines[0]

  // Calculate weekly completion
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const workoutsThisWeek = history.filter(h => h.isFinished && h.startedAt >= oneWeekAgo)
  const completedDaysThisWeek = new Set(workoutsThisWeek.map(w => w.dayName))

  const totalVolumeOverall = history.reduce((acc, h) => acc + (h.totalVolumeKg || 0), 0)
  const prCount = Object.keys(prs).length

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      {/* Active Workout Floating Banner */}
      {activeSession && (
        <div 
          onClick={onNavigateActive}
          className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-600/20 to-amber-500/20 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 cursor-pointer flex items-center justify-between active:scale-98 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black animate-pulse">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">
                  En Progreso
                </span>
                <span className="text-xs text-slate-300 font-semibold">{activeSession.dayName}</span>
              </div>
              <h4 className="text-sm font-black text-white">{activeSession.title}</h4>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
            <span>Continuar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Greeting Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-1.5">
            <span>¡Hola, {activeProfile.name}!</span>
            <span>{activeProfile.avatar}</span>
          </h2>
          <p className="text-xs text-slate-400">¿Listo para entrenar hoy?</p>
        </div>

        <button
          onClick={onOpenCreateRoutine}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 flex items-center gap-1 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Rutina</span>
        </button>
      </div>

      {/* Suggested Today Hero Card */}
      {suggestedRoutine && (
        <section aria-labelledby="today-routine-heading">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 id="today-routine-heading" className="text-xs font-black uppercase tracking-wider text-slate-300">
                Entrenamiento Sugerido ({suggestedRoutine.dayName})
              </h2>
            </div>
            <span className="text-[11px] font-bold text-amber-400">
              {suggestedRoutine.exercises.length} Ejercicios
            </span>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-900">
            <div className="h-48 w-full relative overflow-hidden">
              <img
                src={suggestedRoutine.banner}
                alt={suggestedRoutine.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-75"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent"></div>

              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-lg">
                  {suggestedRoutine.dayName}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-bold border border-slate-700">
                  {suggestedRoutine.tagline}
                </span>
              </div>
            </div>

            <div className="p-4.5 -mt-12 relative z-10 space-y-3.5">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{suggestedRoutine.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {suggestedRoutine.exercises.map(e => e.name).join(' • ')}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onStartWorkout(suggestedRoutine.id)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>INICIAR ENTRENAMIENTO</span>
                </button>

                <button
                  onClick={() => onSelectDay(suggestedRoutine)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:scale-98 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center"
                  title="Ver lista de ejercicios"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Weekly Adherence Streak Tracker */}
      <section aria-labelledby="weekly-streak-heading" className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span id="weekly-streak-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Racha Semanal
          </span>
          <span className="text-xs font-extrabold text-amber-400">
            {completedDaysThisWeek.size} Completados
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
            const isDone = completedDaysThisWeek.has(day as any)
            const isToday = todayDayName === day

            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : isToday
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                  {day.slice(0, 3)}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className={`w-5 h-5 ${isToday ? 'text-amber-400 animate-pulse' : 'text-slate-700'}`} />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Metrics Cards */}
      <section aria-label="Métricas rápidas" className="grid grid-cols-3 gap-2.5">
        <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-center">
          <Dumbbell className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-base font-black text-white">{history.filter(h => h.isFinished).length}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Sesiones</p>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-center">
          <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-base font-black text-white">{prCount}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Récords (PRs)</p>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-center">
          <Flame className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <p className="text-base font-black text-white">{totalVolumeOverall > 1000 ? `${(totalVolumeOverall / 1000).toFixed(1)}t` : `${totalVolumeOverall}kg`}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Volumen Total</p>
        </div>
      </section>

      {/* Routine Days List */}
      <section aria-labelledby="all-routines-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="all-routines-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Tus Rutinas ({routines.length})
          </h3>
          <span className="text-[11px] text-slate-500">Toca para ver ejercicios</span>
        </div>

        <div className="space-y-2.5">
          {routines.map((day) => {
            const isCompletedThisWeek = completedDaysThisWeek.has(day.dayName)

            return (
              <div
                key={day.id}
                onClick={() => onSelectDay(day)}
                className="p-3.5 rounded-2xl bg-[#0e1526]/90 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-98 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 border border-slate-700">
                    <img
                      src={day.banner}
                      alt={day.dayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-amber-500/20"></div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-white">{day.dayName}:</span>
                      <span className="text-xs font-bold text-slate-300">{day.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{day.exercises.length} ejercicios • {day.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isCompletedThisWeek && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Hecho
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
