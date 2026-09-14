import React, { useEffect, useMemo, useState } from 'react'
import {
  ShieldCheck,
  BookOpen,
  Search,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Users,
  Send,
  RefreshCw,
  CloudUpload,
  Cloud,
  CloudOff,
  Calendar,
  Check,
  AlertTriangle,
  History
} from 'lucide-react'
import type { WorkoutDay, UserProfile, LibraryExercise, MuscleGroup, MuscleGroupMeta, RoutineAssignment } from '../types/workout'
import type { CloudUserSummary } from '../services/firebase'
import { isFirebaseConfigured } from '../services/firebase'
import type { LibraryUploadState } from '../hooks/useWorkoutStore'
import { getMuscleAccent } from '../utils/muscleAccents'

interface AdminViewProps {
  activeProfile: UserProfile
  profiles: UserProfile[]
  routines: WorkoutDay[]
  libraryExercises: LibraryExercise[]
  libraryGroups: MuscleGroupMeta[]
  libraryUpload: LibraryUploadState
  onUploadLibrary: () => Promise<{ success: boolean; message: string }>
  onRefreshLibrary: () => Promise<{ success: boolean; exercises?: LibraryExercise[] }>
  cloudUsers: CloudUserSummary[]
  onRefreshCloudUsers: () => Promise<{ success: boolean; users: CloudUserSummary[] }>
  assignments: RoutineAssignment[]
  onAssignRoutine: (targetProfileId: string, targetProfileName: string, routine: WorkoutDay) => Promise<{ success: boolean; message: string }>
  assignmentStatus: { type: 'success' | 'error'; message: string } | null
  onClearAssignmentStatus: () => void
  onCreateRoutine: () => void
  onEditRoutine: (routine: WorkoutDay) => void
  onDeleteRoutine: (routineId: string) => void
}

type AdminSection = 'libreria' | 'rutinas' | 'usuarios'

interface AssignTarget {
  id: string
  name: string
  avatar?: string
  isAdmin: boolean
  source: 'local' | 'cloud'
}

const MAX_LIBRARY_VISIBLE = 120

export const AdminView: React.FC<AdminViewProps> = ({
  activeProfile,
  profiles,
  routines,
  libraryExercises,
  libraryGroups,
  libraryUpload,
  onUploadLibrary,
  onRefreshLibrary,
  cloudUsers,
  onRefreshCloudUsers,
  assignments,
  onAssignRoutine,
  assignmentStatus,
  onClearAssignmentStatus,
  onCreateRoutine,
  onEditRoutine,
  onDeleteRoutine
}) => {
  const [section, setSection] = useState<AdminSection>('libreria')
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<MuscleGroup | 'Todas'>('Todas')
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('')
  const [selectedTargetId, setSelectedTargetId] = useState<string>('')
  const [refreshingUsers, setRefreshingUsers] = useState(false)
  const [refreshingLibrary, setRefreshingLibrary] = useState(false)

  const firebaseReady = isFirebaseConfigured()

  useEffect(() => {
    if (!assignmentStatus) return
    const timer = setTimeout(() => onClearAssignmentStatus(), 6000)
    return () => clearTimeout(timer)
  }, [assignmentStatus, onClearAssignmentStatus])

  const targets = useMemo<AssignTarget[]>(() => {
    const local: AssignTarget[] = profiles.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isAdmin: Boolean(p.isAdmin),
      source: 'local'
    }))
    const remote: AssignTarget[] = cloudUsers
      .filter(user => !profiles.some(p => p.id === user.id))
      .map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isAdmin: Boolean(user.isAdmin),
        source: 'cloud'
      }))
    return [...local, ...remote].filter(target => target.id !== activeProfile.id)
  }, [profiles, cloudUsers, activeProfile.id])

  const filteredLibrary = useMemo(() => {
    const term = search.trim().toLowerCase()
    return libraryExercises.filter(exercise => {
      const matchesGroup = activeGroup === 'Todas' || exercise.muscleGroup === activeGroup
      const matchesTerm = !term || exercise.name.toLowerCase().includes(term)
      return matchesGroup && matchesTerm
    })
  }, [libraryExercises, search, activeGroup])

  const selectedRoutine = routines.find(r => r.id === selectedRoutineId) || null
  const selectedTarget = targets.find(t => t.id === selectedTargetId) || null

  const handleRefreshUsers = async () => {
    setRefreshingUsers(true)
    await onRefreshCloudUsers()
    setRefreshingUsers(false)
  }

  const handleRefreshLibrary = async () => {
    setRefreshingLibrary(true)
    await onRefreshLibrary()
    setRefreshingLibrary(false)
  }

  const handleAssign = async () => {
    if (!selectedRoutine || !selectedTarget) return
    await onAssignRoutine(selectedTarget.id, selectedTarget.name, selectedRoutine)
  }

  const visibleLibrary = filteredLibrary.slice(0, MAX_LIBRARY_VISIBLE)

  const sections: { id: AdminSection; label: string; icon: React.ElementType }[] = [
    { id: 'libreria', label: `Librería (${libraryExercises.length})`, icon: BookOpen },
    { id: 'rutinas', label: `Rutinas & Asignaciones (${routines.length})`, icon: Calendar },
    { id: 'usuarios', label: `Usuarios (${targets.length + 1})`, icon: Users }
  ]

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300 lg:pb-4">
      {/* Admin Header */}
      <section className="glass-card rounded-3xl p-5 border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <span className="text-4xl p-2 rounded-2xl bg-amber-500/20 border border-amber-500/30">
              {activeProfile.avatar}
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Modo Administrador
              </span>
              <h2 className="text-lg font-black text-white">{activeProfile.name}</h2>
              <p className="text-xs text-slate-400">
                Librería de {libraryExercises.length} ejercicios • {routines.length} rutinas • {assignments.length} asignaciones
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-bold border ${
              firebaseReady
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {firebaseReady ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
              {firebaseReady ? 'Firebase conectado' : 'Firebase sin configurar'}
            </span>

            <button
              onClick={handleRefreshLibrary}
              disabled={refreshingLibrary || !firebaseReady}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingLibrary ? 'animate-spin' : ''}`} />
              <span>Actualizar librería</span>
            </button>

            <button
              onClick={onUploadLibrary}
              disabled={libraryUpload.isUploading || !firebaseReady}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{libraryUpload.isUploading ? 'Subiendo...' : 'Subir librería a Firebase'}</span>
            </button>
          </div>
        </div>

        {/* Library upload progress */}
        {(libraryUpload.isUploading || libraryUpload.message) && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span>{libraryUpload.isUploading ? 'Subiendo ejercicios a Firestore...' : libraryUpload.message}</span>
              <span className="font-mono">{libraryUpload.done}/{libraryUpload.total}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
                style={{ width: `${libraryUpload.total > 0 ? (libraryUpload.done / libraryUpload.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Section tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {sections.map(item => {
          const Icon = item.icon
          const isActive = section === item.id
          return (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black border transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* LIBRARY SECTION */}
      {section === 'libreria' && (
        <section className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar entre los 752 ejercicios..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setActiveGroup('Todas')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                activeGroup === 'Todas'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Todas ({libraryExercises.length})
            </button>
            {libraryGroups.map(group => {
              const accent = getMuscleAccent(group.accent)
              const isActive = activeGroup === group.id
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                    isActive ? accent.button : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {group.label} ({group.count})
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>{filteredLibrary.length} ejercicios encontrados</span>
            {filteredLibrary.length > MAX_LIBRARY_VISIBLE && (
              <span>Mostrando {MAX_LIBRARY_VISIBLE}. Afina la búsqueda.</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
            {visibleLibrary.map(exercise => {
              const group = libraryGroups.find(g => g.id === exercise.muscleGroup)
              const accent = getMuscleAccent(group?.accent)
              return (
                <div
                  key={exercise.id}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{exercise.name}</p>
                    <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border ${accent.badge}`}>
                      {exercise.muscleGroup}
                    </span>
                  </div>
                  <a
                    href={exercise.url}
                    target="_blank"
                    rel="noreferrer"
                    title="Ver ficha del ejercicio"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ROUTINES & ASSIGNMENTS SECTION */}
      {section === 'rutinas' && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5">
          {/* Routines list */}
          <section className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Rutinas del Entrenador ({routines.length})
                </h3>
              </div>
              <button
                onClick={onCreateRoutine}
                className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Rutina</span>
              </button>
            </div>

            {routines.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-8 bg-slate-950 rounded-2xl border border-slate-800">
                No hay rutinas creadas todavía. Crea la primera con "+ Nueva Rutina".
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                {routines.map(routine => {
                  const isSelected = routine.id === selectedRoutineId
                  return (
                    <div
                      key={routine.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                            {routine.dayName}
                          </span>
                          <h4 className="text-sm font-black text-white truncate">{routine.title}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{routine.tagline}</p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {routine.exercises.length} ejercicios
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => onEditRoutine(routine)}
                            title="Editar rutina"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la rutina "${routine.title}"?`)) {
                                onDeleteRoutine(routine.id)
                              }
                            }}
                            title="Eliminar rutina"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-rose-300 border border-slate-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedRoutineId(routine.id)
                          setSection('rutinas')
                        }}
                        className={`w-full py-2 rounded-xl text-[11px] font-black border flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Seleccionada para asignar' : 'Seleccionar para asignar'}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Assignment panel */}
          <div className="space-y-5">
            <section className="glass-panel rounded-3xl p-5 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Asignar Rutina a Usuario
                  </h3>
                </div>
                <button
                  onClick={handleRefreshUsers}
                  disabled={refreshingUsers || !firebaseReady}
                  title="Actualizar usuarios desde Firebase"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 border border-slate-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingUsers ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  1. Rutina a asignar
                </label>
                <select
                  value={selectedRoutineId}
                  onChange={e => setSelectedRoutineId(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecciona una rutina...</option>
                  {routines.map(routine => (
                    <option key={routine.id} value={routine.id}>
                      {routine.dayName} — {routine.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  2. Usuario destino
                </label>
                <select
                  value={selectedTargetId}
                  onChange={e => setSelectedTargetId(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecciona un usuario...</option>
                  {targets.map(target => (
                    <option key={target.id} value={target.id}>
                      {target.avatar ? `${target.avatar} ` : ''}{target.name} {target.source === 'cloud' ? '(nube)' : '(local)'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssign}
                disabled={!selectedRoutine || !selectedTarget || !firebaseReady}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Asignar Rutina</span>
              </button>

              {assignmentStatus && (
                <div className={`p-3 rounded-2xl border text-xs font-bold flex items-start gap-2 ${
                  assignmentStatus.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}>
                  {assignmentStatus.type === 'success'
                    ? <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  <span>{assignmentStatus.message}</span>
                </div>
              )}

              {selectedRoutine && selectedTarget && (
                <p className="text-[11px] text-slate-400 bg-slate-950 rounded-xl p-2.5 border border-slate-800">
                  Se asignará <strong className="text-white">{selectedRoutine.title}</strong> a{' '}
                  <strong className="text-white">{selectedTarget.name}</strong>. Al sincronizar, la rutina aparecerá en su lista.
                </p>
              )}
            </section>

            {/* Assignment history */}
            <section className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Asignaciones Realizadas ({assignments.length})
                </h3>
              </div>

              {assignments.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4 bg-slate-950 rounded-2xl border border-slate-800">
                  Aún no has asignado rutinas.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {assignments.map(assignment => (
                    <div
                      key={assignment.id}
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">{assignment.routineTitle}</span>
                        <span className="text-slate-500 font-mono flex-shrink-0">
                          {new Date(assignment.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-400 truncate">
                        Para: <strong className="text-amber-300">{assignment.assignedToProfileName}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* USERS SECTION */}
      {section === 'usuarios' && (
        <section className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Usuarios y Atletas
              </h3>
            </div>
            <button
              onClick={handleRefreshUsers}
              disabled={refreshingUsers || !firebaseReady}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingUsers ? 'animate-spin' : ''}`} />
              <span>Actualizar desde Firebase</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {/* Active admin */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-2xl">{activeProfile.avatar}</span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">{activeProfile.name}</p>
                  <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Admin activo</p>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            </div>

            {targets.map(target => (
              <div
                key={target.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-2xl">{target.avatar || '🏋️'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{target.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      target.source === 'cloud' ? 'text-cyan-300' : 'text-slate-400'
                    }`}>
                      {target.source === 'cloud' ? 'Sincronizado en Firebase' : 'Perfil local'}
                      {target.isAdmin ? ' • Admin' : ''}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black border flex-shrink-0 ${
                  target.source === 'cloud'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {target.source === 'cloud' ? 'Nube' : 'Local'}
                </span>
              </div>
            ))}
          </div>

          {targets.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-6 bg-slate-950 rounded-2xl border border-slate-800">
              No hay otros usuarios todavía. Crea perfiles locales o espera a que los atletas se sincronicen con Firebase.
            </p>
          )}

          <p className="text-[11px] text-slate-500">
            Los perfiles locales viven en este dispositivo. Los perfiles "Nube" provienen de la colección users de Firestore
            y son a quienes se les puede asignar rutinas de forma remota.
          </p>
        </section>
      )}
    </div>
  )
}
