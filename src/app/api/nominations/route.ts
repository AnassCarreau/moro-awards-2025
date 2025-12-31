import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { calculatePhase, canNominate } from "@/lib/phases";
import { EventConfig } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const supabase = await createClient();

  let query = supabase
    .from("nominations")
    .select("*, profiles(username, avatar_url)");

  if (categoryId) {
    query = query.eq("category_id", parseInt(categoryId));
  }

  const { data, error } = await query.order("nomination_count", {
    ascending: false,
  });

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

  if (!canNominate(phase)) {
    return NextResponse.json(
      { error: "Las nominaciones están cerradas" },
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
  const {
    category_id,
    nominated_user,
    nominated_link,
    nominated_text,
    is_deleted_content,
  } = body;

  // Verificar si ya existe una nominación similar para agrupar
  let existingNomination = null;

  if (nominated_user) {
    const { data } = await supabase
      .from("nominations")
      .select("*")
      .eq("category_id", category_id)
      .ilike("nominated_user", nominated_user)
      .single();
    existingNomination = data;
  }

  if (existingNomination) {
    // Incrementar contador de nominación existente
    const { data, error } = await supabase
      .from("nominations")
      .update({ nomination_count: existingNomination.nomination_count + 1 })
      .eq("id", existingNomination.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  // Crear nueva nominación
  const { data, error } = await supabase
    .from("nominations")
    .insert({
      category_id,
      user_id: user.id,
      nominated_user,
      nominated_link,
      nominated_text,
      is_deleted_content,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
