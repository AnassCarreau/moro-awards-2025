"use client";

import { useEffect, useState, memo, useMemo } from "react";
import { usePhase } from "@/components/providers/phase-provider";
import { getTimeRemaining, formatTimeUnit } from "@/lib/utils";

// Memoizar bloques de tiempo para evitar re-renders innecesarios
const TimeBlock = memo(function TimeBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="countdown-digit gold-text">{formatTimeUnit(value)}</span>
      <span className="text-xs md:text-sm text-gray-400 mt-2 font-medium tracking-wider">
        {label}
      </span>
    </div>
  );
});

const Separator = memo(function Separator() {
  return (
    <span className="text-4xl md:text-6xl text-yellow-500/50 font-bold">:</span>
  );
});

export function MainCountdown() {
  const { phaseInfo } = usePhase();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!phaseInfo.endDate || !phaseInfo.showCountdown) return;

    const updateTime = () => {
      setTimeLeft(getTimeRemaining(phaseInfo.endDate!));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [phaseInfo.endDate, phaseInfo.showCountdown]);

  // Memoizar si mostrar días
  const showDays = useMemo(() => timeLeft.days > 0, [timeLeft.days]);

  if (!mounted) {
    return <CountdownSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* ... header ... */}

      {phaseInfo.showCountdown && phaseInfo.endDate && (
        <div className="glass-card p-8 md:p-12 glow-gold">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {showDays && (
              <>
                <TimeBlock value={timeLeft.days} label="DÍAS" />
                <Separator />
              </>
            )}
            <TimeBlock value={timeLeft.hours} label="HORAS" />
            <Separator />
            <TimeBlock value={timeLeft.minutes} label="MIN" />
            <Separator />
            <TimeBlock value={timeLeft.seconds} label="SEG" />
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton también memoizado
const CountdownSkeleton = memo(function CountdownSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="h-16 w-96 bg-gray-800 rounded-lg animate-pulse mb-8" />
      <div className="h-12 w-80 bg-gray-800 rounded-lg animate-pulse mb-12" />
      <div className="h-40 w-full max-w-xl bg-gray-800 rounded-2xl animate-pulse" />
    </div>
  );
});
