import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

export function getTimeRemaining(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = Math.max(0, targetDate.getTime() - Date.now());

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function extractTwitterHandle(input: string): string | null {
  // Limpia @ del inicio
  if (input.startsWith("@")) {
    return input.slice(1);
  }

  // Extrae handle de URLs de Twitter/X
  const twitterRegex = /(?:twitter\.com|x\.com)\/(@?[\w]+)/i;
  const match = input.match(twitterRegex);

  if (match) {
    return match[1].replace("@", "");
  }

  return input.trim() || null;
}
