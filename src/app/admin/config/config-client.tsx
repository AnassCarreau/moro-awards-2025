"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EventConfig, EventPhase } from "@/types/database";
import { usePhase } from "@/components/providers/phase-provider";
import {
  Calendar,
  Save,
  RefreshCw,
  AlertTriangle,
  Clock,
  Zap,
  Radio,
} from "lucide-react";
import Link from "next/link";

interface ConfigClientProps {
  initialConfig: EventConfig | null;
}

const PHASES: { value: EventPhase | "auto"; label: string; emoji: string }[] = [
  { value: "auto", label: "Automático (usar fechas)", emoji: "🤖" },
  { value: "nominations", label: "Nominaciones", emoji: "📝" },
  { value: "curation", label: "Curación", emoji: "⏳" },
  { value: "voting", label: "Votación", emoji: "🗳️" },
  { value: "gala", label: "Gala", emoji: "🎬" },
  { value: "results", label: "Resultados", emoji: "🏆" },
];

export function ConfigClient({ initialConfig }: ConfigClientProps) {
  const { refreshConfig } = usePhase();
  const [config, setConfig] = useState<EventConfig | null>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">
          Error: No se pudo cargar la configuración
        </p>
      </div>
    );
  }

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // formato: YYYY-MM-DDTHH:mm
  };

  const handleDateChange = (field: keyof EventConfig, value: string) => {
    setConfig({
      ...config,
      [field]: new Date(value).toISOString(),
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar");
      }

      setSaved(true);
      await refreshConfig(); // Actualizar el contexto global

      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  const handleForcePhase = (phase: EventPhase | "auto") => {
    setConfig({
      ...config,
      force_phase: phase === "auto" ? null : phase,
    });
    setSaved(false);
  };

  const handleToggle = (field: "gala_active" | "results_public") => {
    setConfig({
      ...config,
      [field]: !config[field],
    });
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ⚙️ Configuración del Evento
            </h1>
            <p className="text-gray-400">
              Controla las fechas y fases del evento
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/curation"
              className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
            >
              Curación
            </Link>
            <Link
              href="/admin/gala"
              className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
            >
              Sala de Control
            </Link>
          </div>
        </div>

        {/* Controles rápidos */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Gala activa */}
          <button
            onClick={() => handleToggle("gala_active")}
            className={`p-4 rounded-xl border transition-all ${
              config.gala_active
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio
                size={24}
                className={config.gala_active ? "animate-pulse" : ""}
              />
              <div className="text-left">
                <p className="font-semibold">Gala en Directo</p>
                <p className="text-sm opacity-70">
                  {config.gala_active ? "🔴 ACTIVA" : "Inactiva"}
                </p>
              </div>
            </div>
          </button>

          {/* Resultados públicos */}
          <button
            onClick={() => handleToggle("results_public")}
            className={`p-4 rounded-xl border transition-all ${
              config.results_public
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-green-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap size={24} />
              <div className="text-left">
                <p className="font-semibold">Resultados Públicos</p>
                <p className="text-sm opacity-70">
                  {config.results_public ? "✅ Visibles" : "Ocultos"}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Forzar fase */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Forzar Fase (Override)
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Ignora las fechas y fuerza una fase específica. Útil para testing o
            emergencias.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PHASES.map((p) => (
              <button
                key={p.value}
                onClick={() => handleForcePhase(p.value)}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  config.force_phase === p.value ||
                  (p.value === "auto" && !config.force_phase)
                    ? "bg-yellow-500 text-black"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
          {config.force_phase && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-sm text-yellow-400">
                ⚠️ Fase forzada activa: <strong>{config.force_phase}</strong>.
                Las fechas configuradas abajo se ignoran.
              </p>
            </div>
          )}
        </div>

        {/* Fechas */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" />
            Fechas del Evento
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Propuestas */}
            <DateInput
              label="Inicio Nominaciones (Día 1)"
              value={formatDateForInput(config.nominations_start)}
              onChange={(v) => handleDateChange("nominations_start", v)}
            />
            {/* Nominaciones */}
            <DateInput
              label="Fin Nominaciones (Día 2)"
              value={formatDateForInput(config.nominations_end)}
              onChange={(v) => handleDateChange("nominations_end", v)}
            />

            {/* Curación */}
            <DateInput
              label="Fin Curación (Día 3)"
              value={formatDateForInput(config.curation_end)}
              onChange={(v) => handleDateChange("curation_end", v)}
            />

            {/* Votación */}
            <DateInput
              label="Fin Votación (Días 4-5)"
              value={formatDateForInput(config.voting_end)}
              onChange={(v) => handleDateChange("voting_end", v)}
            />

            {/* Gala */}
            <DateInput
              label="Inicio Gala"
              value={formatDateForInput(config.gala_start)}
              onChange={(v) => handleDateChange("gala_start", v)}
            />

            <DateInput
              label="Fin Gala (estimado)"
              value={formatDateForInput(config.gala_end)}
              onChange={(v) => handleDateChange("gala_end", v)}
              className="col-span-2"
            />
          </div>
        </div>
        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
          >
            <AlertTriangle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Botón guardar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <Clock size={14} className="inline mr-1" />
            Configuración del Evento
          </p>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            } disabled:opacity-50`}
          >
            {saving ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : saved ? (
              <>✓ Guardado</>
            ) : (
              <>
                <Save size={20} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-500/50"
      />
    </div>
  );
}
