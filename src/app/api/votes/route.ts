import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { calculatePhase, canVote } from "@/lib/phases";
import { EventConfig } from "@/types/database";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener votos del usuario
  const { data, error } = await supabase
    .from("votes")
    .select("category_id, finalist_id")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // Obtener configuración desde la base de datos
  const { data: config, error: configError } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (configError || !config) {
    return NextResponse.json(
      { error: "Error al obtener configuración del evento" },
      { status: 500 }
    );
  }

  const phase = calculatePhase(config as EventConfig);

  if (!canVote(phase)) {
    return NextResponse.json(
      { error: "La votación no está abierta" },
      { status: 403 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { finalist_id, category_id } = body;

  // Verificar que no haya votado ya en esta categoría
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("category_id", category_id)
    .single();

  if (existingVote) {
    return NextResponse.json(
      { error: "Ya has votado en esta categoría" },
      { status: 400 }
    );
  }

  // Registrar voto
  const { data, error } = await supabase
    .from("votes")
    .insert({
      user_id: user.id,
      finalist_id,
      category_id,
    })
    .select()
    .single();

  if (error) {
    // Posible violación de constraint unique
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ya has votado en esta categoría" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
