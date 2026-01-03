"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { formatTimeUnit } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date | null;
  label: string;
  description: string;
  isLive?: boolean;
}

// Memoizar componentes para evitar re-renders innecesarios
const TimeDigit = memo(function TimeDigit({ digit }: { digit: string }) {
  return (
    <div className="relative">
      <div className="w-14 h-18 sm:w-20 sm:h-26 md:w-28 md:h-36 lg:w-36 lg:h-44 bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-dark-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-black/50 overflow-hidden">
        {/* Línea central */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-dark-700 z-10" />
        {/* Reflejo */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={digit}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gold-400 tabular-nums drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      </div>
      {/* Glow */}
      <div className="absolute inset-0 bg-gold-400/10 rounded-xl sm:rounded-2xl blur-xl -z-10" />
    </div>
  );
});

const TimeUnit = memo(function TimeUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const digits = formatTimeUnit(value).split("");

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 sm:gap-2">
        {digits.map((digit, idx) => (
          <TimeDigit key={idx} digit={digit} />
        ))}
      </div>
      <span className="mt-3 sm:mt-4 uppercase tracking-[0.15em] font-bold text-xs sm:text-sm text-dark-400">
        {label}
      </span>
    </div>
  );
});

const Separator = memo(function Separator() {
  return (
    <div className="flex flex-col justify-center gap-2 sm:gap-3 px-2 sm:px-4 md:px-6 pb-6">
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gold-400 rounded-full shadow-lg shadow-gold-400/50"
      />
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gold-400 rounded-full shadow-lg shadow-gold-400/50"
      />
    </div>
  );
});

function LiveIndicator() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      {/* VERSIÓN SIMPLIFICADA: Solo un pulso suave */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Círculo principal - SIN parpadeos ni opacity changes */}
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border-2 border-red-500/30">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
            <span className="text-white font-bold text-2xl sm:text-4xl tracking-wider">
              LIVE
            </span>
          </div>
        </div>

        {/* Solo UN anillo de pulso suave */}
        <motion.div
          animate={{
            scale: [1, 1.8],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full border border-red-500/50"
        />
      </motion.div>
    </motion.div>
  );
}
function WaitingIndicator() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-dark-700 border-t-gold-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">⚙️</span>
        </div>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            className="w-2 h-2 bg-gold-400 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

export function CountdownTimer({
  targetDate,
  label,
  description,
  isLive = false,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const showDays = days > 0;

  return (
    <div className="w-full flex flex-col items-center gap-6 sm:gap-8 py-4 sm:py-8">
      {/* Label */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wider text-center px-4 ${
          isLive ? "text-red-500" : "text-gold-400"
        }`}
      >
        {label}
      </motion.h2>

      {/* Contenido */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        {isLive ? (
          <LiveIndicator />
        ) : !targetDate ? (
          <WaitingIndicator />
        ) : (
          <div className="flex items-start justify-center flex-wrap">
            {showDays && (
              <>
                <TimeUnit value={days} label="Días" />
                <Separator />
              </>
            )}
            <TimeUnit value={hours} label="Horas" />
            <Separator />
            <TimeUnit value={minutes} label="Minutos" />
            <Separator />
            <TimeUnit value={seconds} label="Segundos" />
          </div>
        )}

        {/* Glow de fondo */}
        <div className="absolute inset-0 bg-gold-400/5 blur-3xl rounded-full -z-20 scale-150" />
      </motion.div>

      {/* Descripción */}
      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-dark-400 text-center max-w-md px-4"
      >
        {description}
      </motion.p>
    </div>
  );
}
