"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Vote, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { VotingCard } from "./VotingCard";
import { createVote } from "@/lib/actions/votes";
import type { Category, Finalist, Vote as VoteType } from "@/types/database";

interface CategoryVotingProps {
  category: Category;
  finalists: Finalist[];
  userVote: VoteType | null;
}

export function CategoryVoting({
  category,
  finalists,
  userVote,
}: CategoryVotingProps) {
  const [isExpanded, setIsExpanded] = useState(!userVote);
  const [selectedId, setSelectedId] = useState<string | null>(
    userVote?.finalist_id || null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasVoted = !!userVote;

  const handleVote = () => {
    if (!selectedId || hasVoted) return;

    setMessage(null);

    startTransition(async () => {
      const result = await createVote(selectedId, category.id);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "¡Voto registrado!" });
      }
    });
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{category.name}</CardTitle>
            {hasVoted && (
              <Badge variant="success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Votado
              </Badge>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-dark-400" />
          </motion.div>
        </div>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              {/* Grid de finalistas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {finalists.map((finalist) => (
                  <VotingCard
                    key={finalist.id}
                    finalist={finalist}
                    isSelected={selectedId === finalist.id}
                    hasVoted={hasVoted}
                    onSelect={() => setSelectedId(finalist.id)}
                  />
                ))}
              </div>

              {/* Mensaje de feedback */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-2 p-4 rounded-xl mb-4 ${
                      message.type === "success"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{message.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón de votar */}
              {!hasVoted && (
                <Button
                  onClick={handleVote}
                  disabled={!selectedId || isPending}
                  isLoading={isPending}
                  className="w-full"
                >
                  <Vote className="w-5 h-5 mr-2" />
                  Confirmar Voto
                </Button>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
