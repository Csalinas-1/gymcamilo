import React, { useState, useEffect } from 'react'
import { 
  User, 
  Save, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Calculator, 
  Download, 
  Upload, 
  LogOut, 
  Users, 
  Check, 
  Sparkles,
  RotateCcw
} from 'lucide-react'
import type { UserProfile } from '../types/workout'

interface UserSettingsViewProps {
  activeProfile: UserProfile
  onUpdateProfile: (updates: Partial<UserProfile>) => void
  onOpenProfileSwitcher: () => void
  onLogout: () => void
  onOpenPlateCalculator: (weight?: number) => void
  onExportBackup: () => void
  onImportBackup: (jsonStr: string) => boolean
  onResetRoutines: () => void
}

const AVATARS = ['🦍', '⚡', '🔥', '💪', '🦁', '🥊', '🐺', '🦈', '👑', '🚀', '🥋', '🏆']

const GOALS = [
  'Hipertrofia & Masa',
  'Fuerza Máxima',
  'Definición & Pérdida de Grasa',
  'Rendimiento Atlético / Rugby',
  'Salud & Acondicionamiento'
]

export const UserSettingsView: React.FC<UserSettingsViewProps> = ({
  activeProfile,
  onUpdateProfile,
  onOpenProfileSwitcher,
  onLogout,
  onOpenPlateCalculator,
  onExportBackup,
  onImportBackup,
  onResetRoutines
}) => {
  const [name, setName] = useState(activeProfile.name || '')
  const [avatar, setAvatar] = useState(activeProfile.avatar || '🦍')
  const [goal, setGoal] = useState(activeProfile.goal || 'Hipertrofia & Masa')
  const [weightKg, setWeightKg] = useState<number | ''>(activeProfile.weightKg || '')
  const [heightCm, setHeightCm] = useState<number | ''>(activeProfile.heightCm || '')
  const [weeklyTargetDays, setWeeklyTargetDays] = useState(activeProfile.weeklyTargetDays || 5)
  const [soundEnabled, setSoundEnabled] = useState(activeProfile.soundEnabled !== false)
  const [vibrationEnabled, setVibrationEnabled] = useState(activeProfile.vibrationEnabled !== false)
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(activeProfile.weightUnit || 'kg')
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  useEffect(() => {
    setName(activeProfile.name || '')
    setAvatar(activeProfile.avatar || '🦍')
    setGoal(activeProfile.goal || 'Hipertrofia & Masa')
    setWeightKg(activeProfile.weightKg || '')
    setHeightCm(activeProfile.heightCm || '')
    setWeeklyTargetDays(activeProfile.weeklyTargetDays || 5)
    setSoundEnabled(activeProfile.soundEnabled !== false)
    setVibrationEnabled(activeProfile.vibrationEnabled !== false)
    setWeightUnit(activeProfile.weightUnit || 'kg')
  }, [activeProfile])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onUpdateProfile({
      name: name.trim(),
      avatar,
      goal,
      weightKg: weightKg === '' ? undefined : Number(weightKg),
      heightCm: heightCm === '' ? undefined : Number(heightCm),
      weeklyTargetDays: Number(weeklyTargetDays),
      soundEnabled,
      vibrationEnabled,
      weightUnit
    })

    setSaveStatus('¡Perfil actualizado con éxito!')
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const success = onImportBackup(text)
      if (success) {
        setImportStatus('¡Datos restaurados con éxito!')
        setTimeout(() => setImportStatus(null), 3500)
      } else {
        setImportStatus('Error al leer el archivo de respaldo.')
        setTimeout(() => setImportStatus(null), 3500)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      {/* Profile Header & Account Switcher */}
      <section aria-labelledby="profile-heading" className="glass-card rounded-3xl p-5 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <span className="text-4xl p-2 rounded-2xl bg-amber-500/20 border border-amber-500/30">
              {avatar}
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                Atleta Activo
              </span>
              <h2 id="profile-heading" className="text-lg font-black text-white">{name}</h2>
              <p className="text-xs text-slate-400">{goal}</p>
            </div>
          </div>

          <button
            onClick={onOpenProfileSwitcher}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Cuentas</span>
          </button>
        </div>
      </section>

      {saveStatus && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* User Personal Data Form */}
      <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Datos Personales
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Configuración de Atleta</span>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Nombre / Apodo
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre..."
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Cambiar Avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setAvatar(item)}
                className={`text-xl p-2 rounded-2xl border transition-all ${
                  avatar === item
                    ? 'bg-amber-500/30 border-amber-400 scale-105 shadow-md'
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
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
          >
            {GOALS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Peso Corporal (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="ej. 80"
              value={weightKg}
              onChange={e => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 text-center"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Altura (cm)
            </label>
            <input
              type="number"
              placeholder="ej. 178"
              value={heightCm}
              onChange={e => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 text-center"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Meta de Entrenamientos por Semana
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setWeeklyTargetDays(d)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  weeklyTargetDays === d
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {d} días
              </button>
            ))}
          </div>
        </div>

        {/* Preferences Toggles */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="text-xs font-bold text-slate-300">Sonidos de Descanso (3-2-1)</span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  soundEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Vibrate className={`w-4 h-4 ${vibrationEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-slate-300">Vibración Háptica en Celular</span>
            </div>
            <button
              type="button"
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                vibrationEnabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  vibrationEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs active:scale-98 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>GUARDAR CAMBIOS DE PERFIL</span>
        </button>
      </form>

      {/* Gym Tools */}
      <section aria-labelledby="gym-tools-heading" className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 id="gym-tools-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Herramientas del Gimnasio
          </h2>
        </div>

        <button
          onClick={() => onOpenPlateCalculator(100)}
          className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-all active:scale-98"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Calculadora Gráfica de Discos</p>
              <p className="text-[11px] text-slate-400">Distribución de discos en Prensa 45°, Barra Olímpica y Smith</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/40">Abrir</span>
        </button>
      </section>

      {/* Backup JSON */}
      <section aria-labelledby="backup-data-heading" className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
        <h2 id="backup-data-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Copia de Seguridad Personal (JSON)
        </h2>

        {importStatus && (
          <p className="text-xs font-bold text-emerald-400 bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/40 text-center">
            {importStatus}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onExportBackup}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-white">Descargar Backup</span>
            <span className="text-[10px] text-slate-400">Guardar mis datos</span>
          </button>

          <label className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 shadow-sm">
            <Upload className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-xs font-bold text-white">Restaurar Backup</span>
            <span className="text-[10px] text-slate-400">Importar archivo</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* Logout & Reset Section */}
      <div className="pt-2 space-y-2 text-center">
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold flex items-center justify-center space-x-2 active:scale-98 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión (Volver a la Pantalla de Inicio)</span>
        </button>

        <button
          onClick={() => {
            if (confirm('¿Restablecer las rutinas a la configuración inicial? Tus entrenamientos guardados no se borrarán.')) {
              onResetRoutines()
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer rutinas de fábrica</span>
        </button>
      </div>
    </div>
  )
}
