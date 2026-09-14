import React from 'react'
import {
  Dumbbell,
  Home,
  Calendar,
  PlayCircle,
  Trophy,
  Settings,
  ShieldCheck,
  PencilRuler,
  Zap
} from 'lucide-react'
import type { NavTab } from './BottomNav'
import type { UserProfile } from '../types/workout'

interface DesktopSidebarProps {
  currentTab: NavTab
  onTabChange: (tab: NavTab) => void
  hasActiveWorkout: boolean
  activeProfile: UserProfile
  isAdmin: boolean
  onOpenProfileSwitcher: () => void
}

interface SidebarItem {
  id: NavTab
  label: string
  description: string
  icon: React.ElementType
  adminOnly?: boolean
  highlightActiveWorkout?: boolean
}

const TRAINING_ITEMS: SidebarItem[] = [
  { id: 'hoy', label: 'Hoy', description: 'Panel y entrenamiento del día', icon: Home },
  { id: 'rutinas', label: 'Rutinas', description: 'Tus planes de entrenamiento', icon: Calendar },
  { id: 'activo', label: 'Sesión', description: 'Entrenamiento en curso', icon: PlayCircle, highlightActiveWorkout: true },
  { id: 'records', label: 'Récords', description: 'PRs y estadísticas', icon: Trophy }
]

const COACH_ITEMS: SidebarItem[] = [
  { id: 'builder', label: 'Constructor', description: 'Crear y editar rutinas', icon: PencilRuler, adminOnly: true },
  { id: 'admin', label: 'Admin', description: 'Librería y asignaciones', icon: ShieldCheck, adminOnly: true }
]

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onTabChange,
  hasActiveWorkout,
  activeProfile,
  isAdmin,
  onOpenProfileSwitcher
}) => {
  const renderItem = (item: SidebarItem) => {
    const Icon = item.icon
    const isActive = currentTab === item.id
    const isCoachStyle = item.id === 'admin' || item.id === 'builder'
    const showLiveDot = item.highlightActiveWorkout && hasActiveWorkout

    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        title={item.description}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
          isActive
            ? isCoachStyle
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border-transparent'
        }`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
        <span className="flex-1 text-left">{item.label}</span>
        {showLiveDot && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Entrenamiento en curso" />
        )}
      </button>
    )
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen z-30 border-r border-slate-800/80 bg-[#0b101c]/95 backdrop-blur-xl">
      {/* Brand */}
      <div className="flex items-center space-x-3 px-5 py-5 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-[1.5px] shadow-lg shadow-amber-500/20">
          <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-white">
            LAZCAKON<span className="text-amber-400">GYM</span>
          </h1>
          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Modo Escritorio
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div className="space-y-1">
          <p className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Entrenamiento
          </p>
          {TRAINING_ITEMS.map(renderItem)}
        </div>

        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Modo Entrenador
            </p>
            {COACH_ITEMS.map(renderItem)}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800/80 space-y-2">
        {hasActiveWorkout && (
          <button
            onClick={() => onTabChange('activo')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black hover:bg-amber-500/25 transition-all"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>Entrenamiento en curso</span>
          </button>
        )}

        <button
          onClick={() => onTabChange('cloud')}
          title="Ajustes, respaldo y sincronización"
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
            currentTab === 'cloud'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border-transparent'
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left">Ajustes</span>
        </button>

        <button
          onClick={onOpenProfileSwitcher}
          title="Cambiar de cuenta o perfil"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/80 transition-all active:scale-[0.98]"
        >
          <span className="text-xl leading-none">{activeProfile.avatar}</span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-xs font-black text-white truncate">{activeProfile.name}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'Entrenador / Admin' : 'Atleta'}
            </span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        </button>
      </div>
    </aside>
  )
}
