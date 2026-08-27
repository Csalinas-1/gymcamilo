import React, { useState } from 'react'
import { X, UserPlus, Check, Trash2, Users } from 'lucide-react'
import type { UserProfile } from '../types/workout'

interface ProfileSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  profiles: UserProfile[]
  activeProfileId: string
  onSwitchProfile: (profileId: string) => void
  onCreateProfile: (name: string, avatar: string) => void
  onDeleteProfile: (profileId: string) => void
}

const AVAILABLE_AVATARS = ['🦍', '⚡', '🔥', '💪', '🦁', '🥊', '🐺', '🦈', '🚀', '👑']

export const ProfileSwitcherModal: React.FC<ProfileSwitcherModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onCreateProfile,
  onDeleteProfile
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🦍')

  if (!isOpen) return null

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    onCreateProfile(newName.trim(), selectedAvatar)
    setNewName('')
    setShowCreateForm(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0d1424] border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Cuentas & Perfiles</h3>
              <p className="text-[11px] text-slate-400">Sin contraseñas • 100% instantáneo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles List */}
        <div className="my-4 space-y-2 max-h-60 overflow-y-auto pr-1">
          {profiles.map(profile => {
            const isActive = profile.id === activeProfileId
            return (
              <div
                key={profile.id}
                onClick={() => {
                  onSwitchProfile(profile.id)
                  onClose()
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {profile.avatar}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-white">{profile.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {isActive ? '✓ Perfil Activo' : 'Toca para cambiar'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {isActive ? (
                    <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteProfile(profile.id)
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Eliminar perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Create Profile Form or Trigger */}
        {showCreateForm ? (
          <form onSubmit={handleCreate} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Nombre de la Cuenta
            </label>
            <input
              type="text"
              placeholder="Tu nombre o apodo..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
              autoFocus
              required
            />

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Elige un Avatar
              </label>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {AVAILABLE_AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-lg p-1.5 rounded-xl border transition-all ${
                      selectedAvatar === avatar
                        ? 'bg-amber-500/30 border-amber-400 scale-110'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md"
              >
                Crear Cuenta
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 active:scale-98 transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>+ Crear Nueva Cuenta</span>
          </button>
        )}
      </div>
    </div>
  )
}
