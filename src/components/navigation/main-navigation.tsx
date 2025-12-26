'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePhase } from '@/components/providers/phase-provider'
import { useAuth } from '@/components/providers/auth-provider'
import { canNominate, canVote } from '@/lib/phases'
import { 
  Send, 
  Vote, 
  Trophy, 
  User,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { LoginModal } from '@/components/auth/login-modal'

export function MainNavigation() {
  const { phase } = usePhase()
  const { user, profile, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const isNominationOpen = canNominate(phase)
  const isVotingOpen = canVote(phase)

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
      <div className="max-w-2xl mx-auto">
        {/* User info */}
        {user && profile && (
          <div className="flex items-center justify-center gap-3 mb-4">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-400">
              {profile.username || 'Usuario'}
            </span>
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {isNominationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <Link
                href="/categorias"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send size={20} />
                <span>NOMINAR</span>
              </Link>
            </motion.div>
          )}

          {isVotingOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <Link
                href="/votar"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Vote size={20} />
                <span>VOTAR</span>
              </Link>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <Link
                href="/resultados"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Trophy size={20} />
                <span>VER RESULTADOS</span>
              </Link>
            </motion.div>
          )}

          {!user && (isNominationOpen || isVotingOpen) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <User size={20} />
                <span>INICIAR SESIÓN</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}