import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("finalists")
    .select("*, categories(name, slug)")
    .order("category_id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
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
  const {
    category_id,
    display_name,
    display_handle,
    display_description,
    original_link,
  } = body;

  // Intentar obtener imagen de Twitter si hay handle
  let display_image = null;
  if (display_handle) {
    display_image = await fetchTwitterProfileImage(display_handle);
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("finalists")
    .insert({
      category_id,
      display_name,
      display_handle,
      display_image,
      display_description,
      original_link,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

async function fetchTwitterProfileImage(
  handle: string
): Promise<string | null> {
  try {
    // Usar servicio de avatar de Twitter
    // Nota: Twitter no tiene API pública de avatares, usar alternativa
    return `https://unavatar.io/twitter/${handle}`;
  } catch {
    return null;
  }
}
