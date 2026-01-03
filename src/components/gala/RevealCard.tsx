"use client";

import { motion } from "framer-motion";
import { Trophy, User, ExternalLink, Crown, Medal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Finalist, Category } from "@/types/database";

interface RevealCardProps {
  finalist: Finalist;
  category: Category;
  index: number;
}

const positionConfig = {
  1: {
    icon: Crown,
    color: "text-gold-400",
    bgColor: "from-gold-500/20 to-gold-600/10",
    borderColor: "border-gold-500/50",
    label: "🥇 1º Puesto",
  },
  2: {
    icon: Medal,
    color: "text-gray-300",
    bgColor: "from-gray-400/20 to-gray-500/10",
    borderColor: "border-gray-400/50",
    label: "🥈 2º Puesto",
  },
  3: {
    icon: Medal,
    color: "text-amber-600",
    bgColor: "from-amber-600/20 to-amber-700/10",
    borderColor: "border-amber-600/50",
    label: "🥉 3º Puesto",
  },
};

export function RevealCard({ finalist, category, index }: RevealCardProps) {
  const position = finalist.final_position || 1;
  const config =
    positionConfig[position as keyof typeof positionConfig] ||
    positionConfig[1];
  const PositionIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
    >
      <Card
        variant="gold"
        className={`relative overflow-hidden bg-gradient-to-br ${config.bgColor} ${config.borderColor}`}
      >
        {/* Efecto de brillo para el ganador */}
        {position === 1 && (
          <>
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-radial from-gold-400/30 via-transparent to-transparent"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gold-shimmer bg-[length:50%_50%]"
            />
          </>
        )}

        <div className="relative p-6">
          {/* Header con categoría */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="gold" className="text-xs">
              {category.name}
            </Badge>
            <div className={`flex items-center gap-1 ${config.color}`}>
              <PositionIcon className="w-5 h-5" />
              <span className="text-sm font-bold">{config.label}</span>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {finalist.display_image ? (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                src={finalist.display_image}
                alt={finalist.display_name}
                className={`w-20 h-20 rounded-xl object-cover border-2 ${config.borderColor}`}
              />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`w-20 h-20 rounded-xl bg-dark-700 flex items-center justify-center border-2 ${config.borderColor}`}
              >
                <User className="w-10 h-10 text-dark-400" />
              </motion.div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-white"
              >
                {finalist.display_name}
              </motion.h3>
              {finalist.display_handle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`${config.color} text-sm`}
                >
                  @{finalist.display_handle}
                </motion.p>
              )}
              {finalist.display_description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-dark-400 text-sm mt-2 line-clamp-2"
                >
                  {finalist.display_description}
                </motion.p>
              )}
            </div>
          </div>

          {/* Link original */}
          {finalist.original_link && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              href={finalist.original_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-sm text-dark-400 hover:text-gold-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver original</span>
            </motion.a>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
