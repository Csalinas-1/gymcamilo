import React from 'react'
import type { WorkoutDay } from '../../types/workout'
import { AVAILABLE_BANNERS, type RoutineMeta } from './routineDefaults'

interface RoutineMetaFieldsProps {
  value: RoutineMeta
  onChange: (updates: Partial<RoutineMeta>) => void
  showBannerPreview?: boolean
}

export const RoutineMetaFields: React.FC<RoutineMetaFieldsProps> = ({
  value,
  onChange,
  showBannerPreview = false
}) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Día / Etiqueta
          </label>
          <input
            type="text"
            placeholder="ej. Sábado"
            value={value.dayName}
            onChange={e => onChange({ dayName: e.target.value })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Título de la Rutina *
          </label>
          <input
            type="text"
            placeholder="ej. Piernas, Glúteos & Core"
            value={value.title}
            onChange={e => onChange({ title: e.target.value })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Subtítulo / Objetivo
        </label>
        <input
          type="text"
          placeholder="ej. Fuerza + Hipertrofia"
          value={value.tagline}
          onChange={e => onChange({ tagline: e.target.value })}
          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Banner Visual
          </label>
          <select
            value={value.banner}
            onChange={e => onChange({ banner: e.target.value })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {AVAILABLE_BANNERS.map(banner => (
              <option key={banner.id} value={banner.id}>{banner.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Color de Acento
          </label>
          <select
            value={value.accentColor}
            onChange={e => onChange({ accentColor: e.target.value as WorkoutDay['accentColor'] })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="emerald">Verde Esmeralda</option>
            <option value="cyan">Cyan Eléctrico</option>
            <option value="amber">Ámbar Fuego</option>
            <option value="purple">Púrpura Neón</option>
          </select>
        </div>

        {showBannerPreview && (
          <div className="col-span-2 rounded-2xl overflow-hidden border border-slate-800 relative h-24 bg-slate-950">
            <img
              src={value.banner}
              alt="Vista previa del banner"
              className="w-full h-full object-cover brightness-75"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
            <span className="absolute bottom-2 left-3 text-[10px] font-black uppercase tracking-wider text-slate-300">
              {value.dayName || 'Día'} • {value.title || 'Título de la rutina'}
            </span>
          </div>
        )}
      </div>
    </>
  )
}
