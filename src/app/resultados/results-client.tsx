'use client'

import { motion } from 'framer-motion'
import { Category, Finalist } from '@/types/database'
import { usePhase } from '@/components/providers/phase-provider'
import { Trophy, Medal } from 'lucide-react'
import Link from 'next/link'

interface ResultsClientProps {
  categories: Category[]
  finalists: Finalist[]
}

export function ResultsClient({ categories, finalists }: ResultsClientProps) {
  const { phase } = usePhase()

  const getFinalistsByCategory = (categoryId: number) => {
    return finalists
      .filter(f => f.category_id === categoryId)
      .sort((a, b) => (a.final_position || 99) - (b.final_position || 99))
  }

  const getTotalVotes = (categoryId: number) => {
    return finalists
      .filter(f => f.category_id === categoryId)
      .reduce((sum, f) => sum + f.vote_count, 0)
  }

  const getPositionIcon = (position: number | null) => {
    switch (position) {
      case 1: return '🏆'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return ''
    }
  }

  const getPositionColor = (position: number | null) => {
    switch (position) {
      case 1: return 'from-yellow-500 to-yellow-600'
      case 2: return 'from-gray-400 to-gray-500'
      case 3: return 'from-amber-700 to-amber-800'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  if (phase !== 'results') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Resultados no disponibles
          </h2>
          <p className="text-gray-400 mb-6">
            Los resultados se publicarán después de la gala.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black gold-text mb-4"
          >
            🏆 RESULTADOS FINALES
          </motion.h1>
          <p className="text-gray-400">Moro TW Awards 2025</p>
        </div>

        {/* Categorías */}
        <div className="space-y-8">
          {categories.map((category, catIndex) => {
            const categoryFinalists = getFinalistsByCategory(category.id)
            const totalVotes = getTotalVotes(category.id)

            if (categoryFinalists.length === 0) return null

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="glass-card overflow-hidden"
              >
                {/* Header de categoría */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 flex items-center justify-center bg-yellow-500/20 rounded-xl text-yellow-500 font-bold">
                      {category.display_order}
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      {category.is_special && category.special_title
                        ? category.special_title
                        : category.name}
                    </h2>
                  </div>
                </div>

                {/* Resultados */}
                <div className="p-6 space-y-4">
                  {categoryFinalists.map((finalist, index) => {
                    const percentage = totalVotes > 0 
                      ? Math.round((finalist.vote_count / totalVotes) * 100)
                      : 0

                    return (
                      <motion.div
                        key={finalist.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                        className={`relative p-4 rounded-xl overflow-hidden ${
                          finalist.final_position === 1 
                            ? 'bg-yellow-500/10 border-2 border-yellow-500/30' 
                            : 'bg-white/5'
                        }`}
                      >
                        {/* Barra de progreso de fondo */}
                        <div 
                          className={`absolute inset-0 bg-gradient-to-r ${getPositionColor(finalist.final_position)} opacity-20`}
                          style={{ width: `${percentage}%` }}
                        />
                        
                        <div className="relative flex items-center gap-4">
                          {/* Posición */}
                          <div className="text-3xl">
                            {getPositionIcon(finalist.final_position)}
                          </div>
                          
                          {/* Avatar */}
                          {finalist.display_image && (
                            <img
                              src={finalist.display_image}
                              alt=""
                              className={`w-14 h-14 rounded-full object-cover ${
                                finalist.final_position === 1 ? 'ring-2 ring-yellow-500' : ''
                              }`}
                            />
                          )}
                          
                          {/* Info */}
                          <div className="flex-1">
                            <p className={`font-bold ${
                              finalist.final_position === 1 ? 'text-yellow-500 text-lg' : 'text-white'
                            }`}>
                              {finalist.display_name}
                            </p>
                            {finalist.display_handle && (
                              <p className="text-sm text-gray-400">
                                @{finalist.display_handle}
                              </p>
                            )}
                          </div>
                          
                          {/* Stats */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                              {percentage}%
                            </p>
                            <p className="text-sm text-gray-400">
                              {finalist.vote_count.toLocaleString()} votos
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            Gracias a todos los que participaron
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}