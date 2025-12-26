'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhase } from '@/components/providers/phase-provider'
import { EventPhase } from '@/types/database'
import { Settings, X, Zap } from 'lucide-react'

const phases: { value: EventPhase; label: string; emoji: string }[] = [
  { value: 'proposals', label: 'Propuestas', emoji: '💡' },
  { value: 'nominations', label: 'Nominaciones', emoji: '📝' },
  { value: 'curation', label: 'Curación', emoji: '⏳' },
  { value: 'voting', label: 'Votación', emoji: '🗳️' },
  { value: 'gala', label: 'Gala', emoji: '🎬' },
  { value: 'results', label: 'Resultados', emoji: '🏆' },
]

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { phase, setDevPhase } = usePhase()

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        title="Dev Tools"
      >
        <Settings size={20} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed left-4 bottom-20 w-72 glass-card p-4 z-50 border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                Dev Tools
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selector de fase */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Simular Fase:</label>
              <div className="grid grid-cols-2 gap-2">
                {phases.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setDevPhase(p.value)}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      phase === p.value
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => setDevPhase(null)}
              className="w-full mt-4 p-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
            >
              Reset (usar fecha real)
            </button>

            {/* Info */}
            <div className="mt-4 p-2 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">
                Fase actual: <span className="text-purple-400">{phase}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Los cambios recargan la página
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}