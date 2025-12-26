'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhase } from '@/components/providers/phase-provider'
import { getTimeRemaining, formatTimeUnit } from '@/lib/utils'

export function MainCountdown() {
  const { phaseInfo } = usePhase()
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!phaseInfo.endDate || !phaseInfo.showCountdown) return

    const updateTime = () => {
      setTimeLeft(getTimeRemaining(phaseInfo.endDate!))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [phaseInfo.endDate, phaseInfo.showCountdown])

  if (!mounted) {
    return <CountdownSkeleton />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Logo/Título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-black gold-text text-center">
          🏆 MORO TW AWARDS 2025
        </h1>
      </motion.div>

      {/* Mensaje de fase */}
      <motion.div
        key={phaseInfo.message}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <h2 className={`text-2xl md:text-4xl font-bold text-center ${
          phaseInfo.phase === 'gala' ? 'text-red-500 pulse-live' : 'text-white'
        }`}>
          {phaseInfo.message}
        </h2>
      </motion.div>

      {/* Contador */}
      {phaseInfo.showCountdown && phaseInfo.endDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 glow-gold"
        >
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {timeLeft.days > 0 && (
              <>
                <TimeBlock value={timeLeft.days} label="DÍAS" />
                <Separator />
              </>
            )}
            <TimeBlock value={timeLeft.hours} label="HORAS" />
            <Separator />
            <TimeBlock value={timeLeft.minutes} label="MIN" />
            <Separator />
            <TimeBlock value={timeLeft.seconds} label="SEG" />
          </div>
        </motion.div>
      )}

      {/* Estado especial para gala */}
      {phaseInfo.phase === 'gala' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-red-500 rounded-full pulse-live" />
            <span className="text-xl text-red-500 font-semibold">EN DIRECTO</span>
          </div>
        </motion.div>
      )}

      {/* Curación */}
      {phaseInfo.phase === 'curation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"
            />
            <span className="text-xl text-gray-300">Procesando nominaciones...</span>
          </div>
          <p className="text-gray-500">Los finalistas se anunciarán pronto</p>
        </motion.div>
      )}
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="countdown-digit gold-text"
        >
          {formatTimeUnit(value)}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs md:text-sm text-gray-400 mt-2 font-medium tracking-wider">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <span className="text-4xl md:text-6xl text-yellow-500/50 font-bold">:</span>
  )
}

function CountdownSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="h-16 w-96 bg-gray-800 rounded-lg animate-pulse mb-8" />
      <div className="h-12 w-80 bg-gray-800 rounded-lg animate-pulse mb-12" />
      <div className="h-40 w-full max-w-xl bg-gray-800 rounded-2xl animate-pulse" />
    </div>
  )
}