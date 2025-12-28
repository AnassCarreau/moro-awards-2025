import {
  EventPhase,
  EventConfig,
  PhaseInfo,
  EventDates,
} from "@/types/database";

// Cache local de la configuración
let configCache: EventConfig | null = null;
let configCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Configuración por defecto (fallback si falla la API)
const DEFAULT_CONFIG: EventConfig = {
  id: 1,
  proposals_start: "2024-12-27T00:00:00Z",
  proposals_end: "2024-12-28T00:00:00Z",
  nominations_end: "2024-12-29T00:00:00Z",
  curation_end: "2024-12-30T00:00:00Z",
  voting_end: "2024-12-31T20:00:00Z",
  gala_start: "2024-12-31T21:00:00Z",
  gala_end: "2025-01-01T02:00:00Z",
  force_phase: null,
  gala_active: false,
  results_public: false,
  special_category_title: null,
  special_category_decided: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PHASE_MESSAGES: Record<EventPhase, string> = {
  proposals: "🎯 PROPÓN LA CATEGORÍA ESPECIAL",
  nominations: "📝 CIERRE DE NOMINACIONES",
  curation: "⏳ CERRADO: PROCESANDO FINALISTAS",
  voting: "🗳️ LA VOTACIÓN FINAL TERMINA EN...",
  gala: "🔴 GALA EN DIRECTO",
  results: "🏆 RESULTADOS FINALES",
};

/**
 * Obtiene la configuración del evento (con cache)
 */
export async function getEventConfig(): Promise<EventConfig> {
  const now = Date.now();

  // Retornar cache si es válido
  if (configCache && now - configCacheTime < CACHE_DURATION) {
    return configCache;
  }

  try {
    const response = await fetch("/api/config", {
      next: { revalidate: 60 }, // Cache de Next.js
    });

    if (!response.ok) {
      throw new Error("Error fetching config");
    }

    const config = await response.json();

    // Actualizar cache
    configCache = config;
    configCacheTime = now;

    return config;
  } catch (error) {
    console.error("Error loading config, using defaults:", error);
    return configCache || DEFAULT_CONFIG;
  }
}

/**
 * Versión síncrona para uso inmediato (usa cache o defaults)
 */
export function getEventConfigSync(): EventConfig {
  return configCache || DEFAULT_CONFIG;
}

/**
 * Invalida el cache (llamar después de actualizar config)
 */
export function invalidateConfigCache(): void {
  configCache = null;
  configCacheTime = 0;
}

/**
 * Convierte la configuración a fechas de Date
 */
export function configToDates(config: EventConfig): EventDates {
  return {
    proposalsStart: new Date(config.proposals_start),
    proposalsEnd: new Date(config.proposals_end),
    nominationsEnd: new Date(config.nominations_end),
    curationEnd: new Date(config.curation_end),
    votingEnd: new Date(config.voting_end),
    galaStart: new Date(config.gala_start),
    galaEnd: new Date(config.gala_end),
  };
}

/**
 * Obtiene la fecha actual (con soporte para testing)
 */
export function getCurrentDate(): Date {
  // Para testing local: override desde localStorage
  if (typeof window !== "undefined") {
    const devPhase = localStorage.getItem("dev_force_phase");
    if (devPhase) {
      return getDateForPhase(devPhase as EventPhase, getEventConfigSync());
    }
  }

  // Override desde variable de entorno (para testing)
  const overrideDate = process.env.NEXT_PUBLIC_OVERRIDE_DATE;
  if (overrideDate) {
    return new Date(overrideDate);
  }

  return new Date();
}

/**
 * Genera una fecha de ejemplo para una fase (para testing)
 */
function getDateForPhase(phase: EventPhase, config: EventConfig): Date {
  const dates = configToDates(config);

  switch (phase) {
    case "proposals":
      return new Date(dates.proposalsStart.getTime() + 12 * 60 * 60 * 1000); // +12h
    case "nominations":
      return new Date(dates.proposalsEnd.getTime() + 12 * 60 * 60 * 1000);
    case "curation":
      return new Date(dates.nominationsEnd.getTime() + 12 * 60 * 60 * 1000);
    case "voting":
      return new Date(dates.curationEnd.getTime() + 12 * 60 * 60 * 1000);
    case "gala":
      return new Date(dates.galaStart.getTime() + 30 * 60 * 1000); // +30min
    case "results":
      return new Date(dates.galaEnd.getTime() + 12 * 60 * 60 * 1000);
    default:
      return new Date();
  }
}

/**
 * Calcula la fase actual basándose en la configuración
 */
export function calculatePhase(
  config: EventConfig,
  date: Date = getCurrentDate()
): EventPhase {
  // Si hay una fase forzada en la config, usarla
  if (config.force_phase) {
    return config.force_phase;
  }

  // Si los resultados son públicos, mostrar resultados
  if (config.results_public) {
    return "results";
  }

  // Si la gala está activa, mostrar gala
  if (config.gala_active) {
    return "gala";
  }

  const dates = configToDates(config);

  // Calcular fase basándose en fechas
  if (date < dates.proposalsStart) {
    return "proposals"; // Aún no empieza, mostrar cuenta atrás
  }
  if (date < dates.proposalsEnd) {
    return "proposals";
  }
  if (date < dates.nominationsEnd) {
    return "nominations";
  }
  if (date < dates.curationEnd) {
    return "curation";
  }
  if (date < dates.votingEnd) {
    return "voting";
  }
  if (date < dates.galaEnd) {
    return "gala";
  }

  return "results";
}

/**
 * Obtiene información completa de la fase actual
 */
export function getPhaseInfo(
  config: EventConfig,
  phase?: EventPhase
): PhaseInfo {
  const currentPhase = phase || calculatePhase(config);
  const dates = configToDates(config);

  let endDate: Date | null = null;
  let showCountdown = true;

  switch (currentPhase) {
    case "proposals":
      endDate = dates.proposalsEnd;
      break;
    case "nominations":
      endDate = dates.nominationsEnd;
      break;
    case "curation":
      showCountdown = false;
      break;
    case "voting":
      endDate = dates.votingEnd;
      break;
    case "gala":
      showCountdown = false;
      break;
    case "results":
      showCountdown = false;
      break;
  }

  return {
    phase: currentPhase,
    message: PHASE_MESSAGES[currentPhase],
    endDate,
    showCountdown,
  };
}

/**
 * Helpers para verificar permisos
 */
export function canNominate(phase: EventPhase): boolean {
  return phase === "proposals" || phase === "nominations";
}

export function canVote(phase: EventPhase): boolean {
  return phase === "voting";
}

export function canViewResults(phase: EventPhase): boolean {
  return phase === "results";
}

export function isGalaActive(phase: EventPhase): boolean {
  return phase === "gala";
}
