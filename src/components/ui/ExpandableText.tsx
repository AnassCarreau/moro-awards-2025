"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  variant?: "inline" | "modal";
}

export function ExpandableText({
  text,
  maxLength = 50,
  className,
  variant = "inline",
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const needsTruncation = text.length > maxLength;
  const displayText =
    needsTruncation && !isExpanded
      ? text.substring(0, maxLength) + "..."
      : text;

  if (!needsTruncation) {
    return <span className={className}>{text}</span>;
  }

  if (variant === "modal") {
    return (
      <>
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            "text-left hover:text-gold-400 transition-colors",
            className
          )}
        >
          {text.substring(0, maxLength)}...
          <span className="text-gold-400 text-xs ml-1">[ver más]</span>
        </button>

        {/* Modal */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gold-400">Detalle</h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 text-dark-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-white leading-relaxed">{text}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Variant inline
  return (
    <div className={className}>
      <span>{displayText}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-0.5 text-gold-400 hover:text-gold-300 text-xs ml-1"
      >
        {isExpanded ? (
          <>
            <span>menos</span>
            <ChevronUp className="w-3 h-3" />
          </>
        ) : (
          <>
            <span>más</span>
            <ChevronDown className="w-3 h-3" />
          </>
        )}
      </button>
    </div>
  );
}
