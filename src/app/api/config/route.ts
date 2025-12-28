import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getCached, setCache } from "@/lib/cache";

const CACHE_KEY = "event_config";
const CACHE_TTL = 60; // 60 segundos

export async function GET() {
  // Intentar cache primero
  const cached = getCached(CACHE_KEY, CACHE_TTL);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "HIT",
      },
    });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Guardar en cache
  setCache(CACHE_KEY, data);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "X-Cache": "MISS",
    },
  });
}
