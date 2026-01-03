"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval?: number;
  enabled?: boolean;
  onNewData?: (data: T, prevData: T | null) => void;
}

export function usePolling<T>({
  fetcher,
  interval = 10000,
  enabled = true,
  onNewData,
}: UsePollingOptions<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const prevDataRef = useRef<T | null>(null);
  const isMountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      const newData = await fetcher();

      if (!isMountedRef.current) return;

      if (
        onNewData &&
        JSON.stringify(newData) !== JSON.stringify(prevDataRef.current)
      ) {
        onNewData(newData, prevDataRef.current);
      }

      prevDataRef.current = newData;
    } catch (err) {
      console.error("Polling error:", err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, onNewData]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) return;

    fetch();
    const timer = setInterval(fetch, interval);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
    };
  }, [fetch, interval, enabled]);

  return { isLoading };
}
