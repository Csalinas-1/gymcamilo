export interface MuscleAccentStyle {
  badge: string
  button: string
  dot: string
}

const DEFAULT_ACCENT: MuscleAccentStyle = {
  badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  button: 'bg-slate-700 text-slate-100 border-slate-600',
  dot: 'bg-slate-400'
}

export const MUSCLE_ACCENT_STYLES: Record<string, MuscleAccentStyle> = {
  amber: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    button: 'bg-amber-500 text-slate-950 border-amber-400',
    dot: 'bg-amber-400'
  },
  slate: {
    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    button: 'bg-slate-200 text-slate-950 border-slate-100',
    dot: 'bg-slate-300'
  },
  emerald: {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    button: 'bg-emerald-500 text-slate-950 border-emerald-400',
    dot: 'bg-emerald-400'
  },
  cyan: {
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    button: 'bg-cyan-500 text-slate-950 border-cyan-400',
    dot: 'bg-cyan-400'
  },
  purple: {
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    button: 'bg-purple-500 text-white border-purple-400',
    dot: 'bg-purple-400'
  },
  rose: {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    button: 'bg-rose-500 text-white border-rose-400',
    dot: 'bg-rose-400'
  },
  orange: {
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    button: 'bg-orange-500 text-slate-950 border-orange-400',
    dot: 'bg-orange-400'
  },
  sky: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    button: 'bg-sky-500 text-slate-950 border-sky-400',
    dot: 'bg-sky-400'
  },
  teal: {
    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    button: 'bg-teal-500 text-slate-950 border-teal-400',
    dot: 'bg-teal-400'
  },
  indigo: {
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    button: 'bg-indigo-500 text-white border-indigo-400',
    dot: 'bg-indigo-400'
  }
}

export function getMuscleAccent(accent?: string): MuscleAccentStyle {
  return (accent && MUSCLE_ACCENT_STYLES[accent]) || DEFAULT_ACCENT
}
