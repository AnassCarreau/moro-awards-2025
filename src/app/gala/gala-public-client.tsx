"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Finalist } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Radio, Clock } from "lucide-react";
import Link from "next/link";

interface GalaPublicClientProps {
  categories: Category[];
  initialFinalists: Finalist[];
  isGalaActive: boolean;
  specialCategoryTitle?: string | null;
}

export function GalaPublicClient({
  categories,
  initialFinalists,
  isGalaActive,
  specialCategoryTitle,
}: GalaPublicClientProps) {
  const [finalists, setFinalists] = useState(initialFinalists);
  const [lastRevealed, setLastRevealed] = useState<Finalist | null>(null);
  const supabase = createClient();

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!isGalaActive) return;

    const channel = supabase
      .channel("gala-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "finalists",
          filter: "is_revealed=eq.true",
        },
        (payload) => {
          const updatedFinalist = payload.new as Finalist;

          // Actualizar lista
          setFinalists((prev) =>
            prev.map((f) => (f.id === updatedFinalist.id ? updatedFinalist : f))
          );

          // Mostrar animación del último revelado
          setLastRevealed(updatedFinalist);

          // Limpiar después de 5 segundos
          setTimeout(() => setLastRevealed(null), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isGalaActive, supabase]);

  // Refrescar datos cada 10 segundos como fallback
  useEffect(() => {
    if (!isGalaActive) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("finalists")
        .select("*")
        .eq("is_revealed", true)
        .order("revealed_at", { ascending: false });

      if (data) {
        setFinalists((prev) => {
          const updated = [...prev];
          data.forEach((newF) => {
            const idx = updated.findIndex((f) => f.id === newF.id);
            if (idx >= 0) {
              updated[idx] = newF;
            }
          });
          return updated;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isGalaActive, supabase]);

  const revealedFinalists = finalists.filter((f) => f.is_revealed);
  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "Categoría";
  };

  const getPositionEmoji = (position: number | null) => {
    switch (position) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🎖️";
    }
  };

  if (!isGalaActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            La gala aún no ha comenzado
          </h2>
          <p className="text-gray-400 mb-6">
            Vuelve cuando empiece el directo para ver los resultados en tiempo
            real.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 font-bold">EN DIRECTO</span>
          </div>
          <h1 className="text-4xl font-black gold-text">🏆 GALA EN VIVO</h1>
          <p className="text-gray-400 mt-2">
            Los resultados aparecen aquí en tiempo real
          </p>
        </div>

        {/* Último revelado (animación grande) */}
        <AnimatePresence>
          {lastRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="mb-8 p-8 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border-2 border-yellow-500 rounded-2xl text-center glow-gold"
            >
              <p className="text-yellow-500 font-semibold mb-2">
                {getCategoryName(lastRevealed.category_id)}
              </p>
              <div className="text-6xl mb-4">
                {getPositionEmoji(lastRevealed.final_position)}
              </div>
              <p className="text-sm text-gray-400 mb-2">
                {lastRevealed.final_position === 1
                  ? "GANADOR/A"
                  : lastRevealed.final_position === 2
                  ? "2º LUGAR"
                  : lastRevealed.final_position === 3
                  ? "3º LUGAR"
                  : "FINALISTA"}
              </p>
              <h2 className="text-3xl font-black text-white">
                {lastRevealed.display_name}
              </h2>
              {lastRevealed.display_handle && (
                <p className="text-xl text-gray-400">
                  @{lastRevealed.display_handle}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de revelados */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-400">
            Resultados revelados ({revealedFinalists.length})
          </h3>

          {revealedFinalists.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Radio className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-400">
                Esperando a que se revelen los primeros resultados...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {revealedFinalists
                .sort(
                  (a, b) =>
                    new Date(b.revealed_at || 0).getTime() -
                    new Date(a.revealed_at || 0).getTime()
                )
                .map((finalist, index) => (
                  <motion.div
                    key={finalist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass-card p-4 flex items-center gap-4 ${
                      finalist.final_position === 1
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : ""
                    }`}
                  >
                    <div className="text-3xl">
                      {getPositionEmoji(finalist.final_position)}
                    </div>

                    {finalist.display_image && (
                      <img
                        src={finalist.display_image}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        {getCategoryName(finalist.category_id)}
                      </p>
                      <p className="font-bold text-white">
                        {finalist.display_name}
                      </p>
                      {finalist.display_handle && (
                        <p className="text-sm text-gray-400">
                          @{finalist.display_handle}
                        </p>
                      )}
                    </div>

                    {finalist.final_position === 1 && (
                      <Trophy className="text-yellow-500" size={24} />
                    )}
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
