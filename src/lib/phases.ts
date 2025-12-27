import { EventPhase, PhaseInfo } from '@/types/database'

// Fechas del evento (ajustar según necesidad)
export const EVENT_DATES = {
  proposals_start: new Date('2025-12-28T00:00:00Z'),
  proposals_end: new Date('2025-12-29T00:00:00Z'),
  nominations_end: new Date('2025-12-30T00:00:00Z'),
  curation_end: new Date('2025-12-31T00:00:00Z'),
  voting_end: new Date('2025-12-31T20:00:00Z'),
  gala_start: new Date('2025-12-31T21:00:00Z'),
}

export const PHASE_MESSAGES: Record<EventPhase, string> = {
  proposals: '🎯 PROPÓN LA CATEGORÍA ESPECIAL',
  nominations: '📝 CIERRE DE NOMINACIONES',
  curation: '⏳ CERRADO: PROCESANDO FINALISTAS',
  voting: '🗳️ LA VOTACIÓN FINAL TERMINA EN...',
  gala: '🔴 GALA EN DIRECTO',
  results: '🏆 RESULTADOS FINALES',
}

export function getCurrentDate(): Date {
  // Para testing: permite override de fecha
  if (typeof window !== 'undefined') {
    const devPhase = localStorage.getItem('dev_force_phase')
    if (devPhase) {
      return getDateForPhase(devPhase as EventPhase)
    }
  }
  
  const overrideDate = process.env.NEXT_PUBLIC_OVERRIDE_DATE
  if (overrideDate) {
    return new Date(overrideDate)
  }
  
  return new Date()
}

function getDateForPhase(phase: EventPhase): Date {
  switch (phase) {
    case 'proposals':
      return new Date('2025-12-28T12:00:00Z')
    case 'nominations':
      return new Date('2025-12-29T12:00:00Z')
    case 'curation':
      return new Date('2025-12-30T12:00:00Z')
    case 'voting':
      return new Date('2025-12-31T12:00:00Z')
    case 'gala':
      return new Date('2025-12-31T21:30:00Z')
    case 'results':
      return new Date('2026-01-01T12:00:00Z')
    default:
      return new Date()
  }
}

export function calculatePhase(date: Date = getCurrentDate()): EventPhase {
  if (date < EVENT_DATES.proposals_end) return 'proposals'
  if (date < EVENT_DATES.nominations_end) return 'nominations'
  if (date < EVENT_DATES.curation_end) return 'curation'
  if (date < EVENT_DATES.voting_end) return 'voting'
  if (date < new Date(EVENT_DATES.gala_start.getTime() + 4 * 60 * 60 * 1000)) return 'gala'
  return 'results'
}

export function getPhaseInfo(phase?: EventPhase): PhaseInfo {
  const currentPhase = phase || calculatePhase()
  
  let endDate: Date | null = null
  let showCountdown = true
  
  switch (currentPhase) {
    case 'proposals':
      endDate = EVENT_DATES.proposals_end
      break
    case 'nominations':
      endDate = EVENT_DATES.nominations_end
      break
    case 'curation':
      showCountdown = false
      break
    case 'voting':
      endDate = EVENT_DATES.voting_end
      break
    case 'gala':
      showCountdown = false
      break
    case 'results':
      showCountdown = false
      break
  }
  
  return {
    phase: currentPhase,
    message: PHASE_MESSAGES[currentPhase],
    endDate,
    showCountdown,
  }
}

export function canNominate(phase: EventPhase): boolean {
  return phase === 'proposals' || phase === 'nominations'
}

export function canVote(phase: EventPhase): boolean {
  return phase === 'voting'
}

export function canViewResults(phase: EventPhase): boolean {
  return phase === 'results'
}