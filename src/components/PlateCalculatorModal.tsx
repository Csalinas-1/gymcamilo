import React, { useState } from 'react'
import { X, Dumbbell, Sparkles } from 'lucide-react'

interface PlateCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  initialWeight?: number
}

const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]

const PLATE_COLORS: Record<number, { bg: string, text: string, border: string, height: string }> = {
  25: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-400', height: 'h-24' },
  20: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400', height: 'h-22' },
  15: { bg: 'bg-amber-500', text: 'text-slate-950', border: 'border-amber-300', height: 'h-20' },
  10: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-400', height: 'h-16' },
  5: { bg: 'bg-slate-300', text: 'text-slate-900', border: 'border-slate-100', height: 'h-14' },
  2.5: { bg: 'bg-zinc-700', text: 'text-slate-200', border: 'border-zinc-500', height: 'h-12' },
  1.25: { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-400', height: 'h-10' }
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 100
}) => {
  const [equipmentType, setEquipmentType] = useState<'prensa' | 'barra' | 'smith'>('prensa')
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight || 100)
  const [baseWeight, setBaseWeight] = useState<number>(50) // 50kg for Prensa 45° carriage

  if (!isOpen) return null

  const handleEquipmentChange = (type: 'prensa' | 'barra' | 'smith') => {
    setEquipmentType(type)
    if (type === 'prensa') setBaseWeight(50)
    else if (type === 'barra') setBaseWeight(20)
    else if (type === 'smith') setBaseWeight(15)
  }

  // Calculate plates per side
  const weightToDistribute = Math.max(0, targetWeight - baseWeight)
  const weightPerSide = weightToDistribute / 2

  const calculatedPlates: { weight: number; count: number }[] = []
  let remainingPerSide = weightPerSide

  AVAILABLE_PLATES.forEach(plate => {
    if (remainingPerSide >= plate) {
      const count = Math.floor(remainingPerSide / plate)
      calculatedPlates.push({ weight: plate, count })
      remainingPerSide = Number((remainingPerSide - count * plate).toFixed(2))
    }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1424] border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Calculadora de Discos</h3>
              <p className="text-[11px] text-slate-400">Distribución por lado para Prensa & Barra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Equipment Selector */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            onClick={() => handleEquipmentChange('prensa')}
            className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
              equipmentType === 'prensa'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800'
            }`}
          >
            Prensa 45° (50kg)
          </button>
          <button
            onClick={() => handleEquipmentChange('barra')}
            className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
              equipmentType === 'barra'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800'
            }`}
          >
            Barra Olímpica (20kg)
          </button>
          <button
            onClick={() => handleEquipmentChange('smith')}
            className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
              equipmentType === 'smith'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800'
            }`}
          >
            Smith / Guiada (15kg)
          </button>
        </div>

        {/* Target Weight Input with Quick Steppers */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Peso Total Objetivo
          </label>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTargetWeight(prev => Math.max(baseWeight, prev - 10))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-lg font-bold text-slate-200 active:scale-95 transition-all"
              >
                -10
              </button>
              <button
                onClick={() => setTargetWeight(prev => Math.max(baseWeight, prev - 2.5))}
                className="w-9 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition-all"
              >
                -2.5
              </button>
            </div>

            <div className="flex items-baseline justify-center font-mono">
              <input
                type="number"
                value={targetWeight}
                onChange={e => setTargetWeight(Number(e.target.value) || 0)}
                className="w-24 text-3xl font-black text-center bg-transparent text-emerald-400 focus:outline-none border-b-2 border-emerald-500/50"
              />
              <span className="text-sm font-bold text-slate-400 ml-1">kg</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTargetWeight(prev => prev + 2.5)}
                className="w-9 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition-all"
              >
                +2.5
              </button>
              <button
                onClick={() => setTargetWeight(prev => prev + 10)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-lg font-bold text-slate-200 active:scale-95 transition-all"
              >
                +10
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <span>Carro/Barra base: <strong className="text-white">{baseWeight} kg</strong></span>
            <span>Por cada lado: <strong className="text-cyan-400">{weightPerSide} kg</strong></span>
          </div>
        </div>

        {/* Visual Barbell / Sleeve Diagram */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Discos por lado:
            </span>
            {remainingPerSide > 0 && (
              <span className="text-[10px] text-amber-400 font-medium">
                (Faltan {remainingPerSide * 2}kg no exactos)
              </span>
            )}
          </div>

          {/* Visual Plates Display */}
          <div className="h-28 flex items-center justify-center space-x-1.5 overflow-x-auto py-2 bg-slate-900/50 rounded-xl border border-slate-800/50 px-3">
            {/* Bar Sleeve Start */}
            <div className="w-5 h-8 bg-slate-700 rounded-l border border-slate-600 flex-shrink-0"></div>

            {calculatedPlates.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Solo la barra / carro ({baseWeight} kg)</span>
            ) : (
              calculatedPlates.map(item => {
                const config = PLATE_COLORS[item.weight] || PLATE_COLORS[20]
                return Array.from({ length: item.count }).map((_, idx) => (
                  <div
                    key={`${item.weight}-${idx}`}
                    className={`w-7 ${config.height} ${config.bg} ${config.text} ${config.border} border-2 rounded-md flex flex-col items-center justify-center shadow-lg font-black text-[11px] flex-shrink-0 animate-in zoom-in-50 duration-150`}
                  >
                    <span>{item.weight}</span>
                  </div>
                ))
              })
            )}

            {/* Collar / End */}
            <div className="w-3 h-10 bg-slate-600 rounded-r border border-slate-500 flex-shrink-0"></div>
          </div>

          {/* Plates Count Summary List */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {calculatedPlates.map(item => (
              <div
                key={item.weight}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${PLATE_COLORS[item.weight]?.bg || 'bg-slate-400'}`}></span>
                  <span className="font-bold text-white">{item.weight} kg</span>
                </div>
                <span className="font-extrabold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/50">
                  {item.count} {item.count === 1 ? 'disco' : 'discos'} / lado
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm active:scale-98 transition-all shadow-lg shadow-emerald-500/20"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
