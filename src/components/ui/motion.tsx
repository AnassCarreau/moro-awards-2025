"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";

// Cargar framer-motion solo cuando se necesite
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const MotionSpan = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.span),
  { ssr: false }
);

// Re-exportar AnimatePresence
export { AnimatePresence } from "framer-motion";

// Componentes con fallback estático
export function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

export function ScaleIn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

// Para contadores animados
export function AnimatedDigit({ value }: { value: string }) {
  return (
    <MotionSpan
      key={value}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    >
      {value}
    </MotionSpan>
  );
}
