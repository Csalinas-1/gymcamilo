import React, { useState } from 'react'
import { X, ExternalLink, Video, Plus, Trash2, CheckCircle, Dumbbell, BookOpen } from 'lucide-react'
import type { Exercise, CustomExerciseLink } from '../types/workout'

interface ExerciseModalProps {
  exercise: Exercise | null
  isOpen: boolean
  onClose: () => void
  customLinks: CustomExerciseLink[]
  onAddCustomLink: (link: CustomExerciseLink) => void
  onDeleteCustomLink: (exerciseId: string, linkId: string) => void
  isAlternativeSelected?: boolean
  onToggleAlternative?: (exerciseId: string) => void
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  isOpen,
  onClose,
  customLinks = [],
  onAddCustomLink,
  onDeleteCustomLink,
  isAlternativeSelected = false,
  onToggleAlternative
}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newPlatform, setNewPlatform] = useState<'youtube' | 'instagram' | 'tiktok' | 'other'>('youtube')
  const [newNotes, setNewNotes] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  if (!isOpen || !exercise) return null

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim() || !newTitle.trim()) return

    const newLink: CustomExerciseLink = {
      id: 'link_' + Date.now(),
      exerciseId: exercise.id,
      title: newTitle.trim(),
      url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
      platform: newPlatform,
      notes: newNotes.trim()
    }

    onAddCustomLink(newLink)
    setNewTitle('')
    setNewUrl('')
    setNewNotes('')
    setShowAddForm(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1424] border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {exercise.objective}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Descanso: {exercise.restText}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              {isAlternativeSelected ? exercise.alternative : exercise.name}
            </h3>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              🎯 {exercise.targetMuscles}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alternative Banner */}
        {exercise.alternative && (
          <div className="mt-3.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Alternativa de Ejercicio</p>
                <p className="text-xs font-semibold text-cyan-300">{exercise.alternative}</p>
              </div>
            </div>
            {onToggleAlternative && (
              <button
                onClick={() => onToggleAlternative(exercise.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isAlternativeSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isAlternativeSelected ? 'En Uso' : 'Usar Esta'}
              </button>
            )}
          </div>
        )}

        {/* Technique Cues */}
        {exercise.techniqueCues && exercise.techniqueCues.length > 0 && (
          <div className="mt-4 bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800/80">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Puntos Clave de Técnica</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {exercise.techniqueCues.map((cue, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Video Tutorial Default Link */}
        {exercise.defaultVideoUrl && (
          <div className="mt-4">
            <a
              href={exercise.defaultVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/40 text-red-300 hover:text-white hover:border-red-500/70 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-red-500/30 text-red-300 group-hover:scale-110 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Ver Tutorial de Técnica en YouTube</p>
                  <p className="text-[11px] text-red-300/80">Video demostrativo y postura correcta</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-red-400" />
            </a>
          </div>
        )}

        {/* Custom Links & User Hyperlinks */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mis Hipervínculos & Videos ({customLinks.length})
            </h4>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancelar' : 'Agregar Link'}</span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddLink} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5 mb-3 animate-in fade-in">
              <input
                type="text"
                placeholder="Título (ej. Postura de pies en Prensa)"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="url"
                placeholder="URL del video / reel (ej. https://...)"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex gap-2">
                <select
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value as any)}
                  className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none"
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram Reel</option>
                  <option value="tiktok">TikTok</option>
                  <option value="other">Otro Link</option>
                </select>
                <input
                  type="text"
                  placeholder="Nota (opcional)"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                Guardar Hipervínculo
              </button>
            </form>
          )}

          {customLinks.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic text-center py-2">
              No tienes links personalizados guardados aún.
            </p>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {customLinks.map(link => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center space-x-2 text-slate-200 hover:text-emerald-400 truncate"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold truncate">{link.title}</span>
                  </a>
                  <button
                    onClick={() => onDeleteCustomLink(exercise.id, link.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs active:scale-98 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
