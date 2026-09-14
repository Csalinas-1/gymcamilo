import React from 'react'
import { Dumbbell, Zap } from 'lucide-react'
import type { UserProfile } from '../types/workout'

interface NavbarProps {
  activeSessionActive: boolean
  onNavigateActive: () => void
  activeProfile: UserProfile
  onOpenProfileSwitcher: () => void
  wide?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSessionActive,
  onNavigateActive,
  activeProfile,
  onOpenProfileSwitcher,
  wide = false
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className={`mx-auto flex items-center justify-between ${wide ? 'max-w-7xl' : 'max-w-md'}`}>
        {/* Brand & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-[1.5px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center">
              LAZCAKON<span className="text-amber-400">GYM</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Modo Offline & Gimnasio
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2">
          {activeSessionActive && (
            <button
              onClick={onNavigateActive}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse hover:bg-amber-500/30 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>En Vivo</span>
            </button>
          )}

          {/* User Profile Switcher Button */}
          <button
            onClick={onOpenProfileSwitcher}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Cambiar de cuenta o perfil"
          >
            <span className="text-sm">{activeProfile.avatar}</span>
            <span className="max-w-[80px] truncate">{activeProfile.name}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
