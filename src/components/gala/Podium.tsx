"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal, ExternalLink, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finalist } from "@/types/database";

interface PodiumProps {
  finalists: Finalist[];
  categoryName: string;
}

function getAvatarUrl(finalist: Finalist): string | null {
  if (finalist.display_handle)
    return `https://unavatar.io/twitter/${finalist.display_handle}`;
  return null;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

// Detectar si es contenido largo (texto o descripción)
function isLongContent(finalist: Finalist): boolean {
  return (
    finalist.display_name.length > 20 ||
    (finalist.display_description?.length || 0) > 50
  );
}

export function Podium({ finalists, categoryName }: PodiumProps) {
  const sorted = [...finalists].sort(
    (a, b) => (a.final_position || 99) - (b.final_position || 99)
  );

  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  if (!first) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gold-400 mb-8"
      >
        {categoryName}
      </motion.h2>

      <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8">
        {second && <PodiumPlace finalist={second} position={2} delay={0.3} />}
        <PodiumPlace finalist={first} position={1} delay={0.6} />
        {third && <PodiumPlace finalist={third} position={3} delay={0.1} />}
      </div>
    </motion.div>
  );
}

interface PodiumPlaceProps {
  finalist: Finalist;
  position: 1 | 2 | 3;
  delay: number;
}

const podiumStyles = {
  1: {
    // Altura: de 160px (h-40) a 256px (h-64) en escritorio
    height: "h-40 sm:h-52 md:h-64",
    color: "bg-gradient-to-t from-gold-600 to-gold-400",
    textColor: "text-gold-400",
    borderColor: "border-gold-400",
    icon: Crown,
    // Ancho: mucho más espacio para el nombre (hasta 240px en escritorio)
    size: "w-32 sm:w-44 md:w-60",
    // Avatar: aumentado para que destaque en el podio grande
    avatarSize: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36",
  },
  2: {
    height: "h-32 sm:h-40 md:h-52",
    color: "bg-gradient-to-t from-gray-500 to-gray-300",
    textColor: "text-gray-300",
    borderColor: "border-gray-400",
    icon: Medal,
    size: "w-28 sm:w-36 md:w-52",
    avatarSize: "w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32",
  },
  3: {
    height: "h-24 sm:h-32 md:h-44",
    color: "bg-gradient-to-t from-amber-700 to-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-600",
    icon: Medal,
    size: "w-28 sm:w-36 md:w-52",
    avatarSize: "w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32",
  },
};
function PodiumPlace({ finalist, position, delay }: PodiumPlaceProps) {
  const [showDetail, setShowDetail] = useState(false);
  const styles = podiumStyles[position];
  const Icon = styles.icon;
  const avatarUrl = getAvatarUrl(finalist);
  const hasLongContent = isLongContent(finalist);

  // Determinar qué mostrar como nombre
  const displayName = finalist.display_handle
    ? `@${finalist.display_handle}`
    : truncateText(finalist.display_name, 45);

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.8, type: "spring" }}
        className={cn("flex flex-col items-center", styles.size)}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="relative mb-2 sm:mb-3"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={finalist.display_name}
              className={cn(
                "rounded-full object-cover border-4 bg-dark-700",
                styles.avatarSize,
                styles.borderColor
              )}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  finalist.display_name.substring(0, 2)
                )}&background=1e293b&color=fbbf24`;
              }}
            />
          ) : (
            <div
              className={cn(
                "rounded-full bg-dark-700 flex items-center justify-center border-4",
                styles.avatarSize,
                styles.borderColor
              )}
            >
              {/* Icono diferente para texto vs usuario */}
              {hasLongContent ? (
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-dark-400" />
              ) : (
                <span className="text-xl sm:text-2xl">🏆</span>
              )}
            </div>
          )}

          {/* Icono de posición */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.5, type: "spring" }}
            className={cn(
              "absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center",
              position === 1
                ? "bg-gold-500"
                : position === 2
                ? "bg-gray-400"
                : "bg-amber-600"
            )}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-dark-900" />
          </motion.div>
        </motion.div>

        {/* Nombre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
          className="text-center mb-2 w-full"
        >
          <p
            className={cn(
              "font-bold text-xs sm:text-sm truncate px-1",
              styles.textColor
            )}
          >
            {displayName}
          </p>

          {/* Botón ver detalle si es contenido largo O tiene link */}
          {(hasLongContent || finalist.original_link) && (
            <button
              onClick={() => setShowDetail(true)}
              className="inline-flex items-center gap-1 text-dark-400 hover:text-gold-400 transition-colors mt-1"
            >
              {finalist.original_link ? (
                <ExternalLink className="w-3 h-3" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              <span className="text-xs">
                {finalist.original_link ? "Ver" : "Detalle"}
              </span>
            </button>
          )}
        </motion.div>

        {/* Podio */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
          style={{ originY: 1 }}
          className={cn(
            "w-full rounded-t-lg flex items-center justify-center",
            styles.height,
            styles.color
          )}
        >
          <span className="text-2xl sm:text-3xl md:text-5xl font-black text-dark-900/50">
            {position}
          </span>
        </motion.div>
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
              className={cn(
                "bg-dark-800 border-2 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto",
                styles.borderColor
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-6 h-6", styles.textColor)} />
                  <span className={cn("font-bold", styles.textColor)}>
                    {position === 1
                      ? "🥇 Ganador"
                      : position === 2
                      ? "🥈 2º Puesto"
                      : "🥉 3º Puesto"}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1 text-dark-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido */}
              <h3 className="text-xl font-bold text-white mb-3">
                {finalist.display_name}
              </h3>

              {finalist.display_handle && (
                <p className={cn("text-sm mb-3", styles.textColor)}>
                  @{finalist.display_handle}
                </p>
              )}

              {finalist.display_description && (
                <p className="text-dark-300 leading-relaxed mb-4">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
