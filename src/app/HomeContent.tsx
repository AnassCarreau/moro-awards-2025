"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles, Vote, Award, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/countdown/CountdownTimer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePhase } from "@/hooks/usePhase";
import { canNominate, canVote } from "@/lib/phases";
import type { PhaseInfo } from "@/lib/phases";
import { useEffect, useState } from "react";

interface HomeContentProps {
  initialPhaseInfo: PhaseInfo | null;
}

export function HomeContent({ initialPhaseInfo }: HomeContentProps) {
  const { phaseInfo } = usePhase();
  const currentPhase = phaseInfo || initialPhaseInfo;
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>(
    []
  );

  // Generar posiciones de partículas solo en el cliente
  useEffect(() => {
    setParticles(
      [...Array(20)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }))
    );
  }, []);
  if (!currentPhase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const showNominateButton = canNominate(currentPhase.phase);
  const showVoteButton = canVote(currentPhase.phase);
  const showGalaButton =
    currentPhase.phase === "gala" || currentPhase.phase === "results";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Partículas decorativas de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
            }}
            animate={{
              y: [null, particle.y - 500],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-gold-400 rounded-full"
          />
        ))}
      </div>
      {/* Hero Section - Centro de Mando */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        {/* Logo y Título */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative mb-6 md:mb-10"
        >
          {/* Trofeo con efectos */}
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-10"
            >
              <Trophy className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 text-gold-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]" />
            </motion.div>

            {/* Estrellas orbitando */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2.6,
                }}
                className="absolute inset-0"
                style={{ transformOrigin: "center center" }}
              >
                <Star className="w-4 h-4 text-gold-300 absolute -top-4 left-1/2 -translate-x-1/2 fill-gold-300" />
              </motion.div>
            ))}

            {/* Glow grande */}
            <div className="absolute inset-0 bg-gold-400/30 blur-[60px] rounded-full scale-150 -z-10" />
          </div>
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              MORO TW AWARDS
            </span>
          </h1>
        </motion.div>

        {/* Año con badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 md:mb-12"
        >
          <Badge
            variant="gold"
            className="text-2xl sm:text-3xl md:text-4xl px-6 py-2 font-black"
          >
            2025
          </Badge>
        </motion.div>

        {/* ============================================ */}
        {/* CONTADOR GIGANTE - CENTRO DE MANDO */}
        {/* ============================================ */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          <CountdownTimer
            targetDate={currentPhase.targetDate}
            label={currentPhase.label}
            description={currentPhase.description}
            isLive={currentPhase.isLive}
          />
        </motion.div>

        {/* Botones de Acción */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8 md:mt-12"
        >
          {showNominateButton && (
            <Link href="/nominar">
              <Button size="lg" className="group text-lg px-8 py-4">
                <Sparkles className="w-6 h-6 mr-2" />
                Nominar Ahora
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-2"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </Link>
          )}

          {showVoteButton && (
            <Link href="/votar">
              <Button size="lg" className="group text-lg px-8 py-4">
                <Vote className="w-6 h-6 mr-2" />
                Votar Ahora
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-2"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </Link>
          )}

          {showGalaButton && (
            <Link href="/gala">
              <Button
                size="lg"
                variant={currentPhase.isLive ? "primary" : "outline"}
                className={`group text-lg px-8 py-4 ${
                  currentPhase.isLive ? "animate-pulse-gold" : ""
                }`}
              >
                <Award className="w-6 h-6 mr-2" />
                {currentPhase.isLive
                  ? "🔴 Ver Gala en Directo"
                  : "Ver Resultados"}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-2"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      {/* Info Cards */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-t from-dark-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-dark-400 uppercase tracking-widest text-sm mb-8"
          >
            ¿Cómo funciona?
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<Sparkles className="w-8 h-8" />}
              title="1. Nominaciones"
              description="Propón a tus favoritos en 24 categorías épicas del Twitter español"
              isActive={currentPhase.phase === "nominations"}
              delay={0}
            />
            <InfoCard
              icon={<Vote className="w-8 h-8" />}
              title="2. Votación"
              description="Vota por los finalistas seleccionados y decide quién merece ganar"
              isActive={currentPhase.phase === "voting"}
              delay={0.1}
            />
            <InfoCard
              icon={<Award className="w-8 h-8" />}
              title="3. La Gala"
              description="Descubre a los ganadores en directo durante la ceremonia"
              isActive={
                currentPhase.phase === "gala" ||
                currentPhase.phase === "results"
              }
              delay={0.2}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
  isActive,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card
        variant={isActive ? "gold" : "glass"}
        hover
        className={`h-full transition-all duration-500 ${
          isActive ? "scale-105" : ""
        }`}
      >
        <CardContent className="p-6 text-center">
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`
              inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
              ${
                isActive
                  ? "bg-gold-500/20 text-gold-400 shadow-lg shadow-gold-500/20"
                  : "bg-dark-700 text-dark-400"
              }
            `}
          >
            {icon}
          </motion.div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isActive ? "text-gold-400" : "text-white"
            }`}
          >
            {title}
          </h3>
          <p className="text-dark-400">{description}</p>

          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <Badge variant="gold">Fase Actual</Badge>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
