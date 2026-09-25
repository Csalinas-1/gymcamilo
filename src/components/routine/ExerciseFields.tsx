import React from 'react'
import { BookOpen } from 'lucide-react'
import type { Exercise } from '../../types/workout'
import { REST_OPTIONS } from './routineDefaults'

interface ExerciseFieldsProps {
  value: Exercise
  onChange: (updates: Partial<Exercise>) => void
  autoFocusName?: boolean
  onPickAlternative?: () => void
}

export const ExerciseFields: React.FC<ExerciseFieldsProps> = ({
  value,
  onChange,
  autoFocusName = false,
  onPickAlternative
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="ej. Hack squat / Smith, Polea, Mancuernas..."
            value={value.alternative}
            onChange={e => onChange({ alternative: e.target.value, alternativeVideoUrl: undefined })}
            className="flex-1 min-w-0 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
          {onPickAlternative && (
            <button
              type="button"
              onClick={onPickAlternative}
              title="Elegir alternativa desde la librería"
              className="flex-shrink-0 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Librería</span>
            </button>
          )}
        </div>
        {value.alternativeVideoUrl && (
          <p className="text-[10px] text-cyan-400 mt-1 truncate">
            Alternativa vinculada a la librería con video de técnica.
          </p>
        )}
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
