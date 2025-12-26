'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category, Finalist } from '@/types/database'
import { usePhase } from '@/components/providers/phase-provider'
import { useAuth } from '@/components/providers/auth-provider'
import { LoginModal } from '@/components/auth/login-modal'
import { canVote } from '@/lib/phases'
import { 
  Trophy, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Lock
} from 'lucide-react'
import Link from 'next/link'

interface VotingClientProps {
  categories: Category[]
  finalists: Finalist[]
}

export function VotingClient({ categories, finalists }: VotingClientProps) {
  const { phase } = usePhase()
  const { user } = useAuth()
  const [currentCategory, setCurrentCategory] = useState(0)
  const [userVotes, setUserVotes] = useState<Record<number, string>>({})
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [votedCategories, setVotedCategories] = useState<Set<number>>(new Set())

  const isVotingOpen = canVote(phase)
  const category = categories[currentCategory]
  const categoryFinalists = finalists.filter(f => f.category_id === category?.id)

  // Cargar votos existentes del usuario
  useEffect(() => {
    if (user) {
      fetch('/api/votes')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const votes: Record<number, string> = {}
            const voted = new Set<number>()
            data.forEach((vote: { category_id: number; finalist_id: string }) => {
              votes[vote.category_id] = vote.finalist_id
              voted.add(vote.category_id)
            })
            setUserVotes(votes)
            setVotedCategories(voted)
          }
        })
        .catch(console.error)
    }
  }, [user])

  const handleVote = async (finalist: Finalist) => {
    if (!user) {
      setShowLogin(true)
      return
    }

    if (votedCategories.has(category.id)) {
      return // Ya votó
    }

    setLoading(true)

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalist_id: finalist.id,
          category_id: category.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      setUserVotes({ ...userVotes, [category.id]: finalist.id })
      setVotedCategories(new Set([...votedCategories, category.id]))
      
      // Avanzar a siguiente categoría después de votar
      setTimeout(() => {
        if (currentCategory < categories.length - 1) {
          setCurrentCategory(currentCategory + 1)
        }
      }, 1500)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Error al votar')
    } finally {
      setLoading(false)
    }
  }

  const hasVotedCurrent = votedCategories.has(category?.id)
  const currentVote = userVotes[category?.id]

  if (!isVotingOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Votación cerrada
          </h2>
          <p className="text-gray-400 mb-6">
            {phase === 'gala' 
              ? 'La gala está en curso. ¡Atento a los resultados!'
              : 'La votación aún no ha comenzado o ya ha terminado.'}
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold gold-text">🏆 Moro TW Awards 2025</h1>
          </Link>
          <h2 className="text-xl text-white">Votación Final</h2>
          
          {/* Progress */}
          <div className="mt-4 flex justify-center gap-1">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  votedCategories.has(cat.id)
                    ? 'bg-green-500'
                    : index === currentCategory
                    ? 'bg-yellow-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {votedCategories.size} de {categories.length} categorías votadas
          </p>
        </div>

        {/* Categoría actual */}
        {category && (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 flex items-center justify-center bg-yellow-500/20 rounded-xl text-yellow-500 font-bold">
                {category.display_order}
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {category.is_special && category.special_title
                    ? category.special_title
                    : category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-400">{category.description}</p>
                )}
              </div>
            </div>

            {/* Estado de voto */}
            {hasVotedCurrent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400"
              >
                <Check size={18} />
                <span>Ya has votado en esta categoría</span>
              </motion.div>
            )}

            {/* Finalistas */}
            <div className="space-y-3">
              {categoryFinalists.map((finalist) => {
                const isSelected = currentVote === finalist.id
                
                return (
                  <motion.button
                    key={finalist.id}
                    whileHover={!hasVotedCurrent ? { scale: 1.02 } : {}}
                    whileTap={!hasVotedCurrent ? { scale: 0.98 } : {}}
                    onClick={() => !hasVotedCurrent && handleVote(finalist)}
                    disabled={hasVotedCurrent || loading}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-yellow-500/20 border-yellow-500'
                        : hasVotedCurrent
                        ? 'bg-white/5 border-white/10 opacity-50'
                        : 'bg-white/5 border-white/10 hover:border-yellow-500/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {finalist.display_image && (
                        <img
                          src={finalist.display_image}
                          alt=""
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white text-lg">
                          {finalist.display_name}
                        </p>
                        {finalist.display_handle && (
                          <p className="text-sm text-gray-400">
                            @{finalist.display_handle}
                          </p>
                        )}
                        {finalist.display_description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {finalist.display_description}
                          </p>
                        )}
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
                        >
                          <Check size={18} className="text-black" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Aviso de voto ciego */}
            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Voto ciego: Los resultados se revelarán en la gala
            </p>
          </motion.div>
        )}

        {/* Navegación */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentCategory(Math.max(0, currentCategory - 1))}
            disabled={currentCategory === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
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

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}