import type { EventConfig, EventPhase } from "@/types/database";

export interface PhaseInfo {
  phase: EventPhase;
  label: string;
  description: string;
  targetDate: Date | null;
  isLive: boolean;
}

export function calculatePhase(config: EventConfig): PhaseInfo {
  const now = new Date();

  // 1. Si results_public es TRUE -> Fase results
  if (config.results_public) {
    return {
      phase: "results",
      label: "🏆 RESULTADOS FINALES",
      description: "Los Moro TW Awards 2025 han concluido",
      targetDate: null,
      isLive: false,
    };
  }

  // 2. Si force_phase NO es NULL -> Override manual
  if (config.force_phase) {
    return getPhaseInfo(config.force_phase, config);
  }

  const nominationsEnd = new Date(config.nominations_end);
  const curationEnd = new Date(config.curation_end);
  const votingEnd = new Date(config.voting_end);
  const galaStart = new Date(config.gala_start);

  // 3. NOW() > gala_start -> Gala
  if (now >= galaStart) {
    return {
      phase: "gala",
      label: "🔴 GALA EN DIRECTO",
      description: "¡La ceremonia de los Moro TW Awards está en marcha!",
      targetDate: null,
      isLive: true,
    };
  }

  // 4. NOW() > voting_end -> Pre-gala (espera)
  if (now >= votingEnd) {
    return {
      phase: "gala", // Técnicamente pre-gala, pero usamos fase gala
      label: "LA GALA COMIENZA EN",
      description: "Votación cerrada. Prepárate para la gran noche.",
      targetDate: galaStart,
      isLive: false,
    };
  }

  // 5. NOW() > curation_end -> Voting
  if (now >= curationEnd) {
    return {
      phase: "voting",
      label: "LA VOTACIÓN FINAL TERMINA EN",
      description: "¡Vota por tus favoritos!",
      targetDate: votingEnd,
      isLive: false,
    };
  }

  // 6. NOW() > nominations_end -> Curation
  if (now >= nominationsEnd) {
    return {
      phase: "curation",
      label: "CERRADO: PROCESANDO FINALISTAS",
      description: "Estamos revisando todas las nominaciones...",
      targetDate: null,
      isLive: false,
    };
  }

  // 7. Fase nominations (por defecto)
  return {
    phase: "nominations",
    label: "CIERRE DE NOMINACIONES EN",
    description: "¡Nomina a tus favoritos antes de que sea tarde!",
    targetDate: nominationsEnd,
    isLive: false,
  };
}

function getPhaseInfo(phase: EventPhase, config: EventConfig): PhaseInfo {
  const phases: Record<EventPhase, Omit<PhaseInfo, "phase">> = {
    nominations: {
      label: "CIERRE DE NOMINACIONES EN",
      description: "¡Nomina a tus favoritos!",
      targetDate: new Date(config.nominations_end),
      isLive: false,
    },
    curation: {
      label: "CERRADO: PROCESANDO FINALISTAS",
      description: "Revisando nominaciones...",
      targetDate: null,
      isLive: false,
    },
    voting: {
      label: "LA VOTACIÓN FINAL TERMINA EN",
      description: "¡Vota por tus favoritos!",
      targetDate: new Date(config.voting_end),
      isLive: false,
    },
    gala: {
      label: "🔴 GALA EN DIRECTO",
      description: "¡La ceremonia está en marcha!",
      targetDate: null,
      isLive: true,
    },
    results: {
      label: "🏆 RESULTADOS FINALES",
      description: "Los premios han concluido",
      targetDate: null,
      isLive: false,
    },
  };

  return { phase, ...phases[phase] };
}

export function canNominate(phase: EventPhase): boolean {
  return phase === "nominations";
}

export function canVote(phase: EventPhase): boolean {
  return phase === "voting";
}
