"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ExternalLink, Check, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Finalist } from "@/types/database";

interface VotingCardProps {
  finalist: Finalist;
  isSelected: boolean;
  hasVoted: boolean;
  onSelect: () => void;
}

function getAvatarUrl(finalist: Finalist): string | null {
  if (finalist.display_handle) {
    return `https://unavatar.io/twitter/${finalist.display_handle}`;
  }
  return null;
}

function isLongContent(finalist: Finalist): boolean {
  return (
    finalist.display_name.length > 30 ||
    (finalist.display_description?.length || 0) > 100
  );
}

export function VotingCard({
  finalist,
  isSelected,
  hasVoted,
  onSelect,
}: VotingCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const avatarUrl = getAvatarUrl(finalist);
  const hasLongContent = isLongContent(finalist);

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetail(true);
  };

  return (
    <>
      <motion.div
        whileHover={!hasVoted ? { scale: 1.02 } : undefined}
        whileTap={!hasVoted ? { scale: 0.98 } : undefined}
      >
        <Card
          variant={isSelected ? "gold" : "default"}
          hover={!hasVoted}
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-300",
            hasVoted && !isSelected && "opacity-50",
            isSelected && "ring-2 ring-gold-500"
          )}
          onClick={() => !hasVoted && onSelect()}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center z-10"
            >
              <Check className="w-5 h-5 text-dark-900" />
            </motion.div>
          )}

          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Avatar o icono */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={finalist.display_name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-dark-600 bg-dark-700 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      finalist.display_name.substring(0, 2)
                    )}&background=1e293b&color=fbbf24`;
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-dark-700 flex items-center justify-center border-2 border-dark-600 shrink-0">
                  {hasLongContent ? (
                    <FileText className="w-8 h-8 text-dark-400" />
                  ) : (
                    <User className="w-8 h-8 text-dark-400" />
                  )}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white line-clamp-1">
                  {finalist.display_name}
                </h3>

                {finalist.display_handle && (
                  <p className="text-gold-400 text-sm">
                    @{finalist.display_handle}
                  </p>
                )}

                {finalist.display_description && (
                  <p
                    className="text-dark-400 text-sm mt-2 line-clamp-2"
                    title={finalist.display_description}
                  >
                    {finalist.display_description}
                  </p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-3 mt-4">
              {finalist.original_link && (
                <a
                  href={finalist.original_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-gold-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver original</span>
                </a>
              )}

              {hasLongContent && (
                <button
                  onClick={handleDetailClick}
                  className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-gold-400 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver detalle</span>
                </button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modal de detalle */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-gold-500/30 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gold-400">
                  Detalle del nominado
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1 text-dark-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido */}
              <h4 className="text-xl font-bold text-white mb-3">
                {finalist.display_name}
              </h4>

              {finalist.display_handle && (
                <p className="text-gold-400 text-sm mb-3">
                  @{finalist.display_handle}
                </p>
              )}

              {finalist.display_description && (
                <p className="text-dark-300 leading-relaxed mb-4 whitespace-pre-wrap">
                  {finalist.display_description}
                </p>
              )}

              {finalist.original_link && (
                <a
                  href={finalist.original_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver contenido original</span>
                </a>
              )}

              {/* Botón cerrar */}
              <button
                onClick={() => setShowDetail(false)}
                className="w-full mt-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
