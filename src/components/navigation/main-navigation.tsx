"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePhase } from "@/components/providers/phase-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { canNominate, canVote } from "@/lib/phases";
import { Send, Vote, Trophy, User, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "@/components/auth/login-modal";

export function MainNavigation() {
  const { phase } = usePhase();
  const { user, profile, loading, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isNominationOpen = canNominate(phase);
  const isVotingOpen = canVote(phase);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
      <div className="max-w-2xl mx-auto">
        {/* User info - Mostrar skeleton mientras carga */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
          </div>
        ) : user ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            {/* Avatar con fallback */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || "Avatar"}
                className="w-8 h-8 rounded-full object-cover border border-white/20"
                onError={(e) => {
                  // Fallback si la imagen falla
                  (
                    e.target as HTMLImageElement
                  ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.username || "U"
                  )}&background=random`;
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
            )}

            <span className="text-sm text-gray-400">
              {profile?.username || user.email?.split("@")[0] || "Usuario"}
            </span>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-gray-500 hover:text-white transition-colors disabled:opacity-50"
              title="Cerrar sesión"
            >
              {signingOut ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
            </button>
          </motion.div>
        ) : null}

        {/* Actions */}
        <div className="flex gap-3">
          {isNominationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              {user ? (
                <Link
                  href="/categorias"
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send size={20} />
                  <span>NOMINAR</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send size={20} />
                  <span>NOMINAR</span>
                </button>
              )}
            </motion.div>
          )}

          {isVotingOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              {user ? (
                <Link
                  href="/votar"
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Vote size={20} />
                  <span>VOTAR</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Vote size={20} />
                  <span>VOTAR</span>
                </button>
              )}
            </motion.div>
          )}

          {phase === "results" && (
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

          {/* Mostrar botón de login solo si no está cargando y no hay usuario */}
          {!loading && !user && !isNominationOpen && !isVotingOpen && (
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
  );
}
