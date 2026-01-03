"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SocialLinks } from "@/components/gala/SocialLinks";
import { RevealCard } from "@/components/gala/RevealCard";
import { Podium } from "@/components/gala/Podium";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { usePolling } from "@/hooks/usePolling";
import type {
  Finalist,
  Category,
  FinalistWithCategory,
} from "@/types/database";

interface GalaContentProps {
  initialFinalists: FinalistWithCategory[];
  isLive: boolean;
  isResults: boolean;
}

export function GalaContent({
  initialFinalists,
  isLive,
  isResults,
}: GalaContentProps) {
  const [finalists, setFinalists] =
    useState<FinalistWithCategory[]>(initialFinalists);
  const [newRevealIds, setNewRevealIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  // Fetcher para polling
  const fetchRevealed = useCallback(async () => {
    const { data } = await supabase
      .from("finalists")
      .select("*, category:categories(*)")
      .eq("is_revealed", true)
      .order("revealed_at", { ascending: false });

    return (data || []) as FinalistWithCategory[];
  }, [supabase]);

  // Handler cuando hay nuevos datos
  const handleNewData = useCallback(
    (
      newData: FinalistWithCategory[],
      prevData: FinalistWithCategory[] | null
    ) => {
      if (!prevData) return;

      const prevIds = new Set(prevData.map((f) => f.id));
      const newIds = newData.filter((f) => !prevIds.has(f.id)).map((f) => f.id);

      if (newIds.length > 0) {
        setNewRevealIds((prev) => new Set([...prev, ...newIds]));

        // Limpiar el indicador de nuevo después de 5 segundos
        setTimeout(() => {
          setNewRevealIds((prev) => {
            const updated = new Set(prev);
            newIds.forEach((id) => updated.delete(id));
            return updated;
          });
        }, 5000);
      }

      setFinalists(newData);
    },
    []
  );

  // Polling cada 5 segundos si está en vivo
  const { isLoading } = usePolling({
    fetcher: fetchRevealed,
    interval: 5000,
    enabled: isLive,
    onNewData: handleNewData,
  });

  // Agrupar por categoría para mostrar podios
  const finalistsByCategory = finalists.reduce((acc, finalist) => {
    const categoryId = finalist.category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: finalist.category,
        finalists: [],
      };
    }
    acc[categoryId].finalists.push(finalist);
    return acc;
  }, {} as Record<number, { category: Category; finalists: FinalistWithCategory[] }>);

  const categories = Object.values(finalistsByCategory).sort((a, b) => {
    // Ordenar por el más reciente revelado primero
    const aLatest = Math.max(
      ...a.finalists.map((f) => new Date(f.revealed_at || 0).getTime())
    );
    const bLatest = Math.max(
      ...b.finalists.map((f) => new Date(f.revealed_at || 0).getTime())
    );
    return bLatest - aLatest;
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Award className="w-12 h-12 text-gold-400" />
            <h1 className="text-4xl md:text-5xl font-black text-gradient-gold">
              {isResults ? "Resultados" : "La Gala"}
            </h1>
            {isLive && (
              <Badge variant="live" className="ml-2">
                🔴 EN DIRECTO
              </Badge>
            )}
          </motion.div>

          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            {isLive
              ? "¡Estamos revelando los ganadores en tiempo real!"
              : "Todos los ganadores de los Moro TW Awards 2025"}
          </p>
        </div>

        {/* Social Links - Solo en directo */}
        {isLive && (
          <SocialLinks
            twitterSpaceUrl={process.env.NEXT_PUBLIC_TWITTER_SPACE_URL}
            discordUrl={process.env.NEXT_PUBLIC_DISCORD_URL}
          />
        )}

        {/* Indicador de polling */}
        {isLive && (
          <div className="flex items-center justify-center gap-2 text-dark-400 text-sm mb-8">
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: isLoading ? Infinity : 0,
                ease: "linear",
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            <span>Actualizando automáticamente...</span>
          </div>
        )}

        {/* Contenido */}
        {finalists.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card variant="glass" className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-16 h-16 text-gold-400 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Esperando revelaciones...
                </h2>
                <p className="text-dark-400">
                  Los ganadores se mostrarán aquí cuando sean anunciados
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-16">
            <AnimatePresence mode="popLayout">
              {categories.map(
                ({ category, finalists: categoryFinalists }, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    {/* Si hay múltiples finalistas, mostrar podio */}
                    {categoryFinalists.length >= 3 ? (
                      <Podium
                        finalists={categoryFinalists}
                        categoryName={category.name}
                      />
                    ) : (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gold-400">
                          {category.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryFinalists.map((finalist, idx) => (
                            <div
                              key={finalist.id}
                              className={
                                newRevealIds.has(finalist.id)
                                  ? "ring-2 ring-gold-400 ring-offset-4 ring-offset-dark-900 rounded-2xl"
                                  : ""
                              }
                            >
                              <RevealCard
                                finalist={finalist}
                                category={category}
                                index={idx}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer info */}
        {isResults && finalists.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-dark-500">
              🏆 Moro TW Awards 2025 - ¡Gracias a todos por participar!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
