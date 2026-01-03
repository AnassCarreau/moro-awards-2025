"use client";

import { motion } from "framer-motion";
import { User, ExternalLink, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Finalist } from "@/types/database";

interface VotingCardProps {
  finalist: Finalist;
  isSelected: boolean;
  hasVoted: boolean;
  onSelect: () => void;
}

export function VotingCard({
  finalist,
  isSelected,
  hasVoted,
  onSelect,
}: VotingCardProps) {
  return (
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
        {/* Indicador de selección */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-dark-900" />
          </motion.div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar o imagen */}
            {finalist.display_image ? (
              <img
                src={finalist.display_image}
                alt={finalist.display_name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-dark-600"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-dark-700 flex items-center justify-center border-2 border-dark-600">
                <User className="w-8 h-8 text-dark-400" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                {finalist.display_name}
              </h3>
              {finalist.display_handle && (
                <p className="text-gold-400 text-sm">
                  @{finalist.display_handle}
                </p>
              )}
              {finalist.display_description && (
                <p className="text-dark-400 text-sm mt-2 line-clamp-2">
                  {finalist.display_description}
                </p>
              )}
            </div>
          </div>

          {/* Link original */}
          {finalist.original_link && (
            <a
              href={finalist.original_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-4 flex items-center gap-2 text-sm text-dark-400 hover:text-gold-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver original</span>
            </a>
          )}
        </div>

        {/* Shimmer effect on hover */}
        {!hasVoted && (
          <div className="absolute inset-0 bg-gold-shimmer bg-[length:200%_100%] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
}
