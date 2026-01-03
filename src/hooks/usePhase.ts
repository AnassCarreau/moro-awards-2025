"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculatePhase, type PhaseInfo } from "@/lib/phases";
import type { EventConfig } from "@/types/database";

export function usePhase() {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("event_config")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) throw error;
      setConfig(data);
    } catch (err) {
      console.error("Error fetching config:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 60000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  const phaseInfo = useMemo(() => {
    if (!config) return null;
    return calculatePhase(config);
  }, [config]);

  useEffect(() => {
    if (!config) return;
    const interval = setInterval(() => {
      setConfig((prev) => (prev ? { ...prev } : null));
    }, 5000);
    return () => clearInterval(interval);
  }, [config]);

  return { phaseInfo, config, isLoading };
}
