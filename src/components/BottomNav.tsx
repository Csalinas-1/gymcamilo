import React from 'react'
import { Home, Calendar, PlayCircle, Trophy, Settings, ShieldCheck } from 'lucide-react'

export type NavTab = 'hoy' | 'rutinas' | 'activo' | 'records' | 'cloud' | 'admin'

interface BottomNavProps {
  currentTab: NavTab
  onTabChange: (tab: NavTab) => void
  hasActiveWorkout: boolean
  isAdmin?: boolean
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  hasActiveWorkout,
  isAdmin = false
}) => {
  const tabs = [
    { id: 'hoy' as NavTab, label: 'Hoy', icon: Home },
    { id: 'rutinas' as NavTab, label: 'Rutinas', icon: Calendar },
    { 
      id: 'activo' as NavTab, 
      label: 'Sesión', 
      icon: PlayCircle, 
      badge: hasActiveWorkout,
      highlight: hasActiveWorkout 
    },
    { id: 'records' as NavTab, label: 'Récords', icon: Trophy },
    ...(isAdmin
      ? [{ id: 'admin' as NavTab, label: 'Admin', icon: ShieldCheck }]
      : []),
    { id: 'cloud' as NavTab, label: 'Ajustes', icon: Settings }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-2xl border-t border-slate-800/90 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] pt-1 px-2">
      <div className="max-w-md lg:max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 py-1.5 transition-all duration-200 active:scale-90 ${
                isActive
                  ? tab.id === 'admin' ? 'text-amber-400' : 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Highlight background pill if active tab */}
              {isActive && (
                <span className={`absolute -top-1 w-8 h-1 rounded-full shadow-sm ${
                  tab.id === 'admin' ? 'bg-amber-400 shadow-amber-400/50' : 'bg-emerald-400 shadow-emerald-400/50'
                }`}></span>
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                )}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#090d16]"></span>
                )}
              </div>

              <span className={`text-[11px] font-semibold tracking-tight mt-1 ${
                isActive
                  ? tab.id === 'admin' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'
                  : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
