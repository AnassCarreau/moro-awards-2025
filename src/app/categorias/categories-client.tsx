"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types/database";
import { usePhase } from "@/components/providers/phase-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { NominationForm } from "@/components/nominations/nomination-form";
import { LoginModal } from "@/components/auth/login-modal";
import { canNominate, canVote } from "@/lib/phases";
import { ChevronRight, Trophy, Lock, Check } from "lucide-react";
import Link from "next/link";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const { phase } = usePhase();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isNominationOpen = canNominate(phase);
  const isVotingOpen = canVote(phase);

  const handleNominationSuccess = () => {
    setSuccessMessage("¡Nominación enviada con éxito!");
    setTimeout(() => {
      setSuccessMessage(null);
      setSelectedCategory(null);
    }, 2000);
  };

  const getModeLabel = (mode: string): string => {
    switch (mode) {
      case "user":
        return "👤 Usuario";
      case "link":
        return "🔗 Enlace";
      case "text":
        return "📝 Texto";
      case "link_or_text":
        return "🔗/📝 Enlace o Texto";
      default:
        return mode;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold gold-text">
              🏆 Moro TW Awards 2025
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Categorías</h2>
          <p className="text-gray-400">
            {isNominationOpen
              ? "Selecciona una categoría para enviar tu nominación"
              : isVotingOpen
              ? "¡La votación está abierta!"
              : "Las nominaciones están cerradas"}
          </p>
        </div>

        {/* Lista de categorías */}
        <div className="space-y-3">
          {initialCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => {
                  if (isNominationOpen || isVotingOpen) {
                    setSelectedCategory(category);
                  }
                }}
                disabled={!isNominationOpen && !isVotingOpen}
                className={`w-full glass-card p-4 flex items-center justify-between transition-all ${
                  isNominationOpen || isVotingOpen
                    ? "hover:border-yellow-500/30 hover:bg-white/10 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 rounded-lg text-yellow-500 font-bold text-sm">
                    {category.display_order}
                  </span>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {getModeLabel(category.mode)}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de nominación */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {successMessage ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={32} className="text-white" />
                  </motion.div>
                  <p className="text-xl font-semibold text-white">
                    {successMessage}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="text-yellow-500" size={24} />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedCategory.name}
                      </h3>
                      {selectedCategory.description && (
                        <p className="text-sm text-gray-400">
                          {selectedCategory.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <NominationForm
                    category={selectedCategory}
                    onSuccess={handleNominationSuccess}
                    onLoginRequired={() => setShowLogin(true)}
                  />

                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 w-full text-center text-gray-400 hover:text-white transition-colors py-2"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
