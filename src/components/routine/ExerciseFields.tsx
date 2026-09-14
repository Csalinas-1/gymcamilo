import React from 'react'
import type { Exercise } from '../../types/workout'
import { REST_OPTIONS } from './routineDefaults'

interface ExerciseFieldsProps {
  value: Exercise
  onChange: (updates: Partial<Exercise>) => void
  autoFocusName?: boolean
}

export const ExerciseFields: React.FC<ExerciseFieldsProps> = ({
  value,
  onChange,
  autoFocusName = false
}) => {
  const handleRestChange = (seconds: number) => {
    onChange({ restSeconds: seconds, restText: `${seconds} s` })
  }

  return (
    <>
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Nombre del Ejercicio *
        </label>
        <input
          type="text"
          placeholder="ej. Prensa 45°, Press Militar, Hip Thrust..."
          value={value.name}
          onChange={e => onChange({ name: e.target.value })}
          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
          autoFocus={autoFocusName}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Zona / Músculos
          </label>
          <input
            type="text"
            placeholder="ej. Cuádriceps, glúteos"
            value={value.targetMuscles}
            onChange={e => onChange({ targetMuscles: e.target.value })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Objetivo
          </label>
          <input
            type="text"
            placeholder="ej. Fuerza + masa"
            value={value.objective}
            onChange={e => onChange({ objective: e.target.value })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Series
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={value.defaultSets}
            onChange={e => onChange({ defaultSets: Number(e.target.value) })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Reps / Tiempo
          </label>
          <input
            type="text"
            placeholder="10-12"
            value={value.repRange}
            onChange={e => onChange({ repRange: e.target.value })}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Descanso (seg)
          </label>
          <select
            value={value.restSeconds}
            onChange={e => handleRestChange(Number(e.target.value))}
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-white font-bold focus:outline-none focus:border-emerald-500"
          >
            {REST_OPTIONS.map(seconds => (
              <option key={seconds} value={seconds}>
                {seconds === 0 ? '0 s (Cardio)' : `${seconds} s`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Máquina / Ejercicio Alternativo
        </label>
        <input
          type="text"
          placeholder="ej. Hack squat / Smith, Polea, Mancuernas..."
          value={value.alternative}
          onChange={e => onChange({ alternative: e.target.value })}
          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          URL Video YouTube de Técnica (Opcional)
        </label>
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={value.defaultVideoUrl || ''}
          onChange={e => onChange({ defaultVideoUrl: e.target.value })}
          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
        />
      </div>
    </>
  )
}
