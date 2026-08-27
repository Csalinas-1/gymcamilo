import React, { useState } from 'react'
import { 
  Download, 
  Upload, 
  Calculator, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles,
  HardDrive
} from 'lucide-react'
import type { UserProfile } from '../types/workout'

interface ToolsAndCloudModalProps {
  activeProfile: UserProfile
  onOpenProfileSwitcher: () => void
  onOpenPlateCalculator: (weight?: number) => void
  onExportBackup: () => void
  onImportBackup: (jsonStr: string) => boolean
  onResetRoutines: () => void
}

export const ToolsAndCloudModal: React.FC<ToolsAndCloudModalProps> = ({
  activeProfile,
  onOpenProfileSwitcher,
  onOpenPlateCalculator,
  onExportBackup,
  onImportBackup,
  onResetRoutines
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null)

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
      {/* Active Profile Section */}
      <section aria-labelledby="profile-heading" className="glass-card rounded-3xl p-5 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <span className="text-3xl p-2 rounded-2xl bg-amber-500/20 border border-amber-500/30">
              {activeProfile.avatar}
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                Perfil Activo
              </span>
              <h2 id="profile-heading" className="text-lg font-black text-white">{activeProfile.name}</h2>
              <p className="text-xs text-slate-400">Datos privados guardados en este dispositivo</p>
            </div>
          </div>

          <button
            onClick={onOpenProfileSwitcher}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md active:scale-95 transition-all"
          >
            Cambiar
          </button>
        </div>
      </section>

      {/* Gym Tools Section */}
      <section aria-labelledby="tools-heading" className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 id="tools-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Herramientas de Gimnasio
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
              <p className="text-[11px] text-slate-400">Distribución de discos por lado para Prensa 45° y barras</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/40">Abrir</span>
        </button>
      </section>

      {/* Privacy & Storage Guarantee */}
      <section aria-labelledby="privacy-heading" className="glass-card rounded-3xl p-4.5 border border-emerald-500/30 space-y-2">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <h3 id="privacy-heading" className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Privacidad y Seguridad Total
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Tus entrenamientos, pesos y notas se guardan en el almacenamiento seguro de tu teléfono. Ninguna persona externa puede acceder ni modificar tu información.
            </p>
          </div>
        </div>
      </section>

      {/* Local Backup Section */}
      <section aria-labelledby="backup-heading" className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <h2 id="backup-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Copia de Seguridad Privada (JSON)
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Descarga un archivo con todos tus entrenamientos para guardarlo en tu celular o transferirlo a otro dispositivo cuando quieras.
        </p>

        {importStatus && (
          <p className="text-xs font-bold text-emerald-400 bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/40 text-center">
            {importStatus}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onExportBackup}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-white">Descargar Backup</span>
            <span className="text-[10px] text-slate-400">Guardar archivo</span>
          </button>

          <label className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 shadow-sm">
            <Upload className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-xs font-bold text-white">Restaurar Backup</span>
            <span className="text-[10px] text-slate-400">Subir archivo</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* Reset Section */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            if (confirm('¿Restablecer las rutinas a la configuración inicial? Tus entrenamientos guardados no se borrarán.')) {
              onResetRoutines()
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer rutinas originales</span>
        </button>
      </div>
    </div>
  )
}
