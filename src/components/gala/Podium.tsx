"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finalist } from "@/types/database";

interface PodiumProps {
  finalists: Finalist[];
  categoryName: string;
}

export function Podium({ finalists, categoryName }: PodiumProps) {
  // Ordenar por posición
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
        className="text-2xl md:text-3xl font-bold text-center text-gold-400 mb-8"
      >
        {categoryName}
      </motion.h2>

      <div className="flex items-end justify-center gap-4 md:gap-8">
        {/* Segundo puesto */}
        {second && <PodiumPlace finalist={second} position={2} delay={0.3} />}

        {/* Primer puesto */}
        <PodiumPlace finalist={first} position={1} delay={0.6} />

        {/* Tercer puesto */}
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
    height: "h-40 md:h-52",
    color: "bg-gradient-to-t from-gold-600 to-gold-400",
    textColor: "text-gold-400",
    icon: Crown,
    size: "w-24 md:w-32",
  },
  2: {
    height: "h-28 md:h-40",
    color: "bg-gradient-to-t from-gray-500 to-gray-300",
    textColor: "text-gray-300",
    icon: Medal,
    size: "w-20 md:w-28",
  },
  3: {
    height: "h-20 md:h-32",
    color: "bg-gradient-to-t from-amber-700 to-amber-500",
    textColor: "text-amber-500",
    icon: Medal,
    size: "w-20 md:w-28",
  },
};

function PodiumPlace({ finalist, position, delay }: PodiumPlaceProps) {
  const styles = podiumStyles[position];
  const Icon = styles.icon;

  return (
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
        className="relative mb-3"
      >
        {finalist.display_image ? (
          <img
            src={finalist.display_image}
            alt={finalist.display_name}
            className={cn(
              "rounded-full object-cover border-4",
              position === 1
                ? "w-20 h-20 md:w-24 md:h-24 border-gold-400"
                : "w-16 h-16 md:w-20 md:h-20 border-dark-400"
            )}
          />
        ) : (
          <div
            className={cn(
              "rounded-full bg-dark-700 flex items-center justify-center border-4",
              position === 1
                ? "w-20 h-20 md:w-24 md:h-24 border-gold-400"
                : "w-16 h-16 md:w-20 md:h-20 border-dark-400"
            )}
          >
            <Trophy className={cn("w-8 h-8", styles.textColor)} />
          </div>
        )}

        {/* Icono de posición */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.5, type: "spring" }}
          className={cn(
            "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center",
            position === 1
              ? "bg-gold-500"
              : position === 2
              ? "bg-gray-400"
              : "bg-amber-600"
          )}
        >
          <Icon className="w-4 h-4 text-dark-900" />
        </motion.div>
      </motion.div>

      {/* Nombre */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
        className={cn(
          "text-center font-bold text-sm md:text-base mb-2 line-clamp-1",
          styles.textColor
        )}
      >
        {finalist.display_name}
      </motion.p>

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
        <span className="text-3xl md:text-5xl font-black text-dark-900/50">
          {position}
        </span>
      </motion.div>
    </motion.div>
  );
}
