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

function getAvatarUrl(finalist: Finalist): string | null {
  if (finalist.display_handle)
    return `https://unavatar.io/twitter/${finalist.display_handle}`;
  return null;
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
  const avatarUrl = getAvatarUrl(finalist);

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
        {position === 1 && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-radial from-gold-400/30 via-transparent to-transparent"
          />
        )}

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="gold" className="text-xs">
              {category.name}
            </Badge>
            <div className={`flex items-center gap-1 ${config.color}`}>
              <PositionIcon className="w-5 h-5" />
              <span className="text-sm font-bold">{config.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Avatar con unavatar.io */}
            {avatarUrl ? (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                src={avatarUrl}
                alt={finalist.display_name}
                className={`w-20 h-20 rounded-xl object-cover border-2 bg-dark-700 ${config.borderColor}`}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    finalist.display_name
                  )}&background=1e293b&color=fbbf24`;
                }}
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

            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-white truncate"
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

          {finalist.original_link && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              href={finalist.original_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-dark-400 hover:text-gold-400 transition-colors"
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
