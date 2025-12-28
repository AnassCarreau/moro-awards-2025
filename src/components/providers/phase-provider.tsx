"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { EventPhase, PhaseInfo, EventConfig } from "@/types/database";
import {
  calculatePhase,
  getPhaseInfo,
  getEventConfig,
  invalidateConfigCache,
  getEventConfigSync,
} from "@/lib/phases";

interface PhaseContextType {
  phase: EventPhase;
  phaseInfo: PhaseInfo;
  config: EventConfig | null;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  setDevPhase: (phase: EventPhase | null) => void;
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [phase, setPhase] = useState<EventPhase>("proposals");
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo>({
    phase: "proposals",
    message: "🎯 PROPÓN LA CATEGORÍA ESPECIAL",
    endDate: null,
    showCountdown: true,
  });
  const [loading, setLoading] = useState(true);

  // Cargar configuración inicial
  const loadConfig = useCallback(async () => {
    try {
      const eventConfig = await getEventConfig();
      setConfig(eventConfig);

      const currentPhase = calculatePhase(eventConfig);
      setPhase(currentPhase);
      setPhaseInfo(getPhaseInfo(eventConfig, currentPhase));
    } catch (error) {
      console.error("Error loading config:", error);
      // Usar configuración por defecto
      const defaultConfig = getEventConfigSync();
      setConfig(defaultConfig);
      const currentPhase = calculatePhase(defaultConfig);
      setPhase(currentPhase);
      setPhaseInfo(getPhaseInfo(defaultConfig, currentPhase));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Actualizar fase cada segundo (para el contador)
  useEffect(() => {
    if (!config) return;

    const updatePhase = () => {
      const currentPhase = calculatePhase(config);
      setPhase(currentPhase);
      setPhaseInfo(getPhaseInfo(config, currentPhase));
    };

    const interval = setInterval(updatePhase, 1000);
    return () => clearInterval(interval);
  }, [config]);

  // Recargar configuración periódicamente (cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      loadConfig();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadConfig]);

  // Función para refrescar manualmente
  const refreshConfig = useCallback(async () => {
    invalidateConfigCache();
    await loadConfig();
  }, [loadConfig]);

  // Para desarrollo: forzar fase
  const setDevPhase = useCallback((devPhase: EventPhase | null) => {
    if (typeof window === "undefined") return;

    if (devPhase) {
      localStorage.setItem("dev_force_phase", devPhase);
    } else {
      localStorage.removeItem("dev_force_phase");
    }

    // Recargar para aplicar cambios
    window.location.reload();
  }, []);

  return (
    <PhaseContext.Provider
      value={{
        phase,
        phaseInfo,
        config,
        loading,
        refreshConfig,
        setDevPhase,
      }}
    >
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  const context = useContext(PhaseContext);
  if (context === undefined) {
    throw new Error("usePhase must be used within a PhaseProvider");
  }
  return context;
}

// Hook para acceder a la configuración directamente
export function useEventConfig() {
  const { config, loading, refreshConfig } = usePhase();
  return { config, loading, refreshConfig };
}
