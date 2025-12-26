'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category, Nomination, Finalist } from '@/types/database'
import { 
  Trophy, 
  AlertTriangle, 
  Check, 
  Users, 
  Link as LinkIcon,
  FileText,
  ChevronDown,
  Star
} from 'lucide-react'

interface CurationClientProps {
  initialNominations: (Nomination & { 
    categories: Category
    profiles: { username: string } | null 
  })[]
  categories: Category[]
  existingFinalists: (Finalist & { categories: { name: string } })[]
}

export function CurationClient({ 
  initialNominations, 
  categories,
  existingFinalists 
}: CurationClientProps) {
  const [nominations, setNominations] = useState(initialNominations)
  const [finalists, setFinalists] = useState(existingFinalists)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const groupedNominations = nominations.reduce((acc, nom) => {
    const catId = nom.category_id
    if (!acc[catId]) acc[catId] = []
    acc[catId].push(nom)
    return acc
  }, {} as Record<number, typeof nominations>)

  const promoteToFinalist = async (nomination: typeof nominations[0]) => {
    setLoading(nomination.id)
    
    try {
      const response = await fetch('/api/admin/finalists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: nomination.category_id,
          display_name: nomination.nominated_user || nomination.nominated_text?.slice(0, 50) || 'Sin nombre',
          display_handle: nomination.nominated_user,
          display_description: nomination.nominated_text,
          original_link: nomination.nominated_link,
          nomination_id: nomination.id,
        }),
      })
      
      if (!response.ok) throw new Error('Error al promover')
      
      const newFinalist = await response.json()
      setFinalists([...finalists, newFinalist])
      
      // Remover de nominaciones
      setNominations(nominations.filter(n => n.id !== nomination.id))
    } catch (error) {
      console.error(error)
      alert('Error al promover a finalista')
    } finally {
      setLoading(null)
    }
  }

  const getCategoryFinalists = (categoryId: number) => {
    return finalists.filter(f => f.category_id === categoryId)
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🔧 Panel de Curación
          </h1>
          <p className="text-gray-400">
            Revisa las nominaciones y promociona a los finalistas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="text-3xl font-bold text-yellow-500">
              {nominations.length}
            </div>
            <div className="text-sm text-gray-400">Nominaciones pendientes</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-3xl font-bold text-green-500">
              {finalists.length}
            </div>
            <div className="text-sm text-gray-400">Finalistas creados</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-3xl font-bold text-purple-500">
              {categories.length}
            </div>
            <div className="text-sm text-gray-400">Categorías</div>
          </div>
        </div>

        {/* Categorías */}
        <div className="space-y-4">
          {categories.map((category) => {
            const catNominations = groupedNominations[category.id] || []
            const catFinalists = getCategoryFinalists(category.id)
            const hasDeletedContent = catNominations.some(n => n.is_deleted_content)
            const isExpanded = selectedCategory === category.id

            return (
              <div key={category.id} className="glass-card overflow-hidden">
                {/* Header de categoría */}
                <button
                  onClick={() => setSelectedCategory(isExpanded ? null : category.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 rounded-lg text-yellow-500 font-bold">
                      {category.display_order}
                    </span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {catNominations.length} nominaciones
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} />
                          {catFinalists.length} finalistas
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {hasDeletedContent && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                        <AlertTriangle size={12} />
                        Contenido borrado
                      </span>
                    )}
                    <ChevronDown 
                      className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </div>
                </button>

                {/* Contenido expandido */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      {/* Finalistas actuales */}
                      {catFinalists.length > 0 && (
                        <div className="p-4 bg-green-500/5 border-b border-white/10">
                          <h4 className="text-sm font-semibold text-green-400 mb-3">
                            ✅ Finalistas confirmados
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {catFinalists.map((finalist) => (
                              <div
                                key={finalist.id}
                                className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg"
                              >
                                {finalist.display_image && (
                                  <img
                                    src={finalist.display_image}
                                    alt=""
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                <span className="text-sm text-white">
                                  {finalist.display_name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Nominaciones */}
                      <div className="p-4 space-y-3">
                        {catNominations.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">
                            No hay nominaciones para esta categoría
                          </p>
                        ) : (
                          catNominations.map((nomination) => (
                            <div
                              key={nomination.id}
                              className={`p-4 rounded-xl border ${
                                nomination.is_deleted_content
                                  ? 'bg-yellow-500/5 border-yellow-500/20'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  {/* Usuario nominado */}
                                  {nomination.nominated_user && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-lg font-semibold text-white">
                                        @{nomination.nominated_user}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Link */}
                                  {nomination.nominated_link && (
                                    <a
                                      href={nomination.nominated_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-2"
                                    >
                                      <LinkIcon size={14} />
                                      Ver contenido original
                                    </a>
                                  )}
                                  
                                  {/* Texto */}
                                  {nomination.nominated_text && (
                                    <p className="text-gray-300 text-sm mb-2">
                                      <FileText size={14} className="inline mr-1" />
                                      {nomination.nominated_text}
                                    </p>
                                  )}
                                  
                                  {/* Contenido borrado warning */}
                                  {nomination.is_deleted_content && (
                                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                      <AlertTriangle size={14} />
                                      <span>Contenido reportado como borrado</span>
                                    </div>
                                  )}
                                  
                                  {/* Meta */}
                                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                    <span>
                                      {nomination.nomination_count} nominaciones similares
                                    </span>
                                    {nomination.profiles?.username && (
                                      <span>
                                        Por: {nomination.profiles.username}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Botón promover */}
                                <button
                                  onClick={() => promoteToFinalist(nomination)}
                                  disabled={loading === nomination.id}
                                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {loading === nomination.id ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <Trophy size={16} />
                                      <span>Hacer Finalista</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}