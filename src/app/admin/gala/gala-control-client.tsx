'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Category, Finalist } from '@/types/database'
import { 
  Trophy, 
  Eye, 
  Zap, 
  Medal,
  Radio,
  ChevronRight
} from 'lucide-react'

interface GalaControlClientProps {
  categories: Category[]
  initialFinalists: Finalist[]
}

export function GalaControlClient({ categories, initialFinalists }: GalaControlClientProps) {
  const [finalists, setFinalists] = useState(initialFinalists)
  const [currentCategory, setCurrentCategory] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const category = categories[currentCategory]
  const categoryFinalists = finalists
    .filter(f => f.category_id === category?.id)
    .sort((a, b) => b.vote_count - a.vote_count)

  const revealFinalist = async (finalist: Finalist, position: number) => {
    setLoading(finalist.id)
    
    try {
      const response = await fetch('/api/admin/gala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalist_id: finalist.id,
          action: 'reveal',
          position,
        }),
      })
      
      if (!response.ok) throw new Error('Error al revelar')
      
      const updated = await response.json()
      setFinalists(finalists.map(f => f.id === updated.id ? updated : f))
    } catch (error) {
      console.error(error)
      alert('Error al revelar ganador')
    } finally {
      setLoading(null)
    }
  }

  const toggleLive = async () => {
    try {
      const response = await fetch('/api/admin/gala', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gala_active: !isLive,
          phase: !isLive ? 'gala' : 'voting',
        }),
      })
      
      if (response.ok) {
        setIsLive(!isLive)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const revealedCount = categoryFinalists.filter(f => f.is_revealed).length

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🎬 Sala de Control - Gala
            </h1>
            <p className="text-gray-400">
              Controla la revelación de ganadores en tiempo real
            </p>
          </div>
          
          {/* Botón LIVE */}
          <button
            onClick={toggleLive}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              isLive
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Radio size={20} />
            {isLive ? '🔴 EN DIRECTO' : 'INICIAR GALA'}
          </button>
        </div>

        {/* Selector de categoría */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map((cat, index) => {
              const catFinalists = finalists.filter(f => f.category_id === cat.id)
              const allRevealed = catFinalists.every(f => f.is_revealed)
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentCategory(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
                    currentCategory === index
                      ? 'bg-yellow-500 text-black'
                      : allRevealed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold">{index + 1}</span>
                  {allRevealed && <span className="ml-1">✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Categoría actual */}
        {category && (
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-yellow-500" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>

            {/* Controles de revelación */}
            <div className="space-y-4">
              {/* Modo Suspense */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <h3 className="text-sm font-semibold text-purple-400 mb-3">
                  🎭 Modo Suspense (para premios importantes)
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const third = categoryFinalists[2]
                      if (third && !third.is_revealed) revealFinalist(third, 3)
                    }}
                    disabled={!categoryFinalists[2] || categoryFinalists[2]?.is_revealed || loading !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                  >
                    <Medal size={18} />
                    VER 3º
                  </button>
                  <button
                    onClick={() => {
                      const second = categoryFinalists[1]
                      if (second && !second.is_revealed) revealFinalist(second, 2)
                    }}
                    disabled={!categoryFinalists[1] || categoryFinalists[1]?.is_revealed || loading !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-500 hover:bg-gray-400 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                  >
                    <Medal size={18} />
                    VER 2º
                  </button>
                  <button
                    onClick={() => {
                      const first = categoryFinalists[0]
                      if (first && !first.is_revealed) revealFinalist(first, 1)
                    }}
                    disabled={!categoryFinalists[0] || categoryFinalists[0]?.is_revealed || loading !== null}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:opacity-50 text-black font-bold rounded-xl transition-colors"
                  >
                    <Trophy size={18} />
                    🏆 GANADOR
                  </button>
                </div>
              </div>

              {/* Modo Rápido */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-400 mb-3">
                  ⚡ Modo Rápido (para premios menores)
                </h3>
                <button
                  onClick={() => {
                    const winner = categoryFinalists[0]
                    if (winner && !winner.is_revealed) revealFinalist(winner, 1)
                  }}
                  disabled={!categoryFinalists[0] || categoryFinalists[0]?.is_revealed || loading !== null}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                >
                  <Zap size={20} />
                  REVELAR GANADOR DIRECTO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview de finalistas */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Finalistas de esta categoría
          </h3>
          <div className="space-y-3">
            {categoryFinalists.map((finalist, index) => (
              <motion.div
                key={finalist.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  finalist.is_revealed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {finalist.display_image && (
                      <img
                        src={finalist.display_image}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-white">
                        {finalist.display_name}
                      </p>
                      {finalist.display_handle && (
                        <p className="text-sm text-gray-400">
                          @{finalist.display_handle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-yellow-500">
                      {finalist.vote_count} votos
                    </span>
                    {finalist.is_revealed ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <Eye size={16} />
                        {finalist.final_position === 1 ? '🏆' : 
                         finalist.final_position === 2 ? '🥈' : 
                         finalist.final_position === 3 ? '🥉' : ''}
                        Revelado
                      </span>
                    ) : (
                      <span className="text-gray-500">Oculto</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentCategory(Math.max(0, currentCategory - 1))}
            disabled={currentCategory === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl transition-colors"
          >
            <ChevronRight className="rotate-180" size={20} />
            Anterior
          </button>
          <button
            onClick={() => setCurrentCategory(Math.min(categories.length - 1, currentCategory + 1))}
            disabled={currentCategory === categories.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl transition-colors"
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}