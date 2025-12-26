import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, '0')
}

export function getTimeRemaining(endDate: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const total = endDate.getTime() - new Date().getTime()
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }
  
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  }
}