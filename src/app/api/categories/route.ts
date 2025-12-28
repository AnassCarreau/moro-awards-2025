import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getCached, setCache } from "@/lib/cache";

const CACHE_KEY = "categories";
const CACHE_TTL = 300; // 5 minutos (las categorías casi nunca cambian)

export async function GET() {
  const cached = getCached(CACHE_KEY, CACHE_TTL);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  setCache(CACHE_KEY, data);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      "X-Cache": "MISS",
    },
  });
}
