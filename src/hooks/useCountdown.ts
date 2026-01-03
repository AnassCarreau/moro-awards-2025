"use client";

import { useState, useEffect, useRef } from "react";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(targetDate: Date | null): CountdownState {
  // Calcular estado inicial INMEDIATAMENTE (no en useEffect)
  const getInitialState = (): CountdownState => {
    if (!targetDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const remaining = getTimeRemaining(targetDate);
    return {
      days: remaining.days,
      hours: remaining.hours,
      minutes: remaining.minutes,
      seconds: remaining.seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownState>(getInitialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // Actualizar inmediatamente al montar o cambiar targetDate
    const updateTime = () => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft({
        days: remaining.days,
        hours: remaining.hours,
        minutes: remaining.minutes,
        seconds: remaining.seconds,
      });
    };

    // Primera actualización inmediata
    updateTime();

    // Calcular ms hasta el próximo segundo exacto para sincronizar
    const now = Date.now();
    const msUntilNextSecond = 1000 - (now % 1000);

    // Primer timeout para sincronizar con el segundo
    const syncTimeout = setTimeout(() => {
      updateTime();

      // Después del sync, usar interval regular
      intervalRef.current = setInterval(updateTime, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(syncTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);

  return timeLeft;
}
