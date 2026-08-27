import React, { useState } from 'react'
import { Dumbbell, UserPlus, ArrowRight, Trash2, Sparkles, ShieldCheck } from 'lucide-react'
import type { UserProfile } from '../types/workout'
import { playSuccessChime } from '../utils/audio'

interface LoginScreenProps {
  profiles: UserProfile[]
  onSelectProfile: (profileId: string) => void
  onCreateProfile: (name: string, avatar: string, goal: string) => void
  onDeleteProfile: (profileId: string) => void
}

const AVATARS = ['🦍', '⚡', '🔥', '💪', '🦁', '🥊', '🐺', '🦈', '👑', '🚀', '🥋', '🏆']

const GOALS = [
  'Hipertrofia & Masa',
  'Fuerza Máxima',
  'Definición & Pérdida de Grasa',
  'Rendimiento Atlético / Rugby',
  'Salud & Acondicionamiento'
]

export const LoginScreen: React.FC<LoginScreenProps> = ({
  profiles,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile
}) => {
  const [showCreateForm, setShowCreateForm] = useState(profiles.length === 0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🦍')
  const [goal, setGoal] = useState('Hipertrofia & Masa')

  const handleLogin = (profileId: string) => {
    playSuccessChime()
    onSelectProfile(profileId)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onCreateProfile(name.trim(), avatar, goal)
    playSuccessChime()
    setName('')
    setShowCreateForm(false)
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between p-5 max-w-md mx-auto selection:bg-amber-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Branding */}
      <div className="pt-8 text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-[2px] shadow-2xl shadow-amber-500/30">
          <div className="w-full h-full bg-[#0b0f19] rounded-[22px] flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            LAZCAKON<span className="text-amber-400">GYM</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">App de entrenamiento y seguimiento de alto rendimiento</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-6">
        {!showCreateForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Selecciona tu Cuenta
              </span>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Crear Cuenta</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  onClick={() => handleLogin(profile.id)}
                  className="p-4 rounded-3xl bg-[#0e1627] border border-slate-800/90 hover:border-amber-500/50 hover:bg-[#131d33] transition-all cursor-pointer flex items-center justify-between group active:scale-98 shadow-lg shadow-black/40"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-700/80 group-hover:scale-110 transition-transform">
                      {profile.avatar}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                        {profile.name}
                      </h3>
                      <p className="text-xs text-slate-400">{profile.goal || 'Atleta'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`¿Eliminar la cuenta de ${profile.name}?`)) {
                            onDeleteProfile(profile.id)
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors opacity-60 hover:opacity-100"
                        title="Eliminar cuenta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center space-x-2 active:scale-98 transition-all"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Crear Otra Cuenta / Atleta</span>
            </button>
          </div>
        ) : (
          /* Create Account Form */
          <form onSubmit={handleCreate} className="glass-card rounded-3xl p-5 border border-slate-700/80 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">Crear Nueva Cuenta</h3>
              </div>
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Volver
                </button>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Tu Nombre o Apodo *
              </label>
              <input
                type="text"
                placeholder="ej. Cristóbal, Juan, Alex..."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-sm bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-amber-500"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Elige tu Avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`text-xl p-2 rounded-2xl border transition-all ${
                      avatar === item
                        ? 'bg-amber-500/30 border-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Objetivo Principal
              </label>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {GOALS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm active:scale-98 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>ENTRAR A LAZCAKONGYM</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Security Badge */}
      <div className="pb-4 text-center">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Acceso directo sin contraseñas • 100% privado en tu celular</span>
        </div>
      </div>
    </div>
  )
}
