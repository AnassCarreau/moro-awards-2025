import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verificar admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();

  // Validar campos requeridos
  const requiredFields = [
    "nominations_start",
    "nominations_end",
    "curation_end",
    "voting_end",
    "gala_start",
    "gala_end",
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Campo requerido: ${field}` },
        { status: 400 }
      );
    }
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("event_config")
    .update({
      nominations_start: body.nominations_start,
      nominations_end: body.nominations_end,
      curation_end: body.curation_end,
      voting_end: body.voting_end,
      gala_start: body.gala_start,
      gala_end: body.gala_end,
      force_phase: body.force_phase,
      gala_active: body.gala_active,
      results_public: body.results_public,
      special_category_title: body.special_category_title,
      special_category_decided: body.special_category_decided,
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    console.error("Error updating config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
