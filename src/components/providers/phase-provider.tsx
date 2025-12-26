'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { EventPhase, PhaseInfo } from '@/types/database'
import { calculatePhase, getPhaseInfo } from '@/lib/phases'

interface PhaseContextType {
  phase: EventPhase
  phaseInfo: PhaseInfo
  setDevPhase: (phase: EventPhase | null) => void
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined)

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<EventPhase>('proposals')
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo>(getPhaseInfo('proposals'))

  useEffect(() => {
    const updatePhase = () => {
      const currentPhase = calculatePhase()
      setPhase(currentPhase)
      setPhaseInfo(getPhaseInfo(currentPhase))
    }

    updatePhase()
    const interval = setInterval(updatePhase, 1000)

    return () => clearInterval(interval)
  }, [])

  const setDevPhase = (devPhase: EventPhase | null) => {
    if (devPhase) {
      localStorage.setItem('dev_force_phase', devPhase)
    } else {
      localStorage.removeItem('dev_force_phase')
    }
    window.location.reload()
  }

  return (
    <PhaseContext.Provider value={{ phase, phaseInfo, setDevPhase }}>
      {children}
    </PhaseContext.Provider>
  )
}

export function usePhase() {
  const context = useContext(PhaseContext)
  if (context === undefined) {
    throw new Error('usePhase must be used within a PhaseProvider')
  }
  return context
}