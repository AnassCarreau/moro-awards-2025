import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Cache de 60 segundos en el edge
export const revalidate = 60;

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }

  // Headers de cache
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
