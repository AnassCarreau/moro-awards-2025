"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createVote(finalistId: string, categoryId: number) {
  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Debes iniciar sesión para votar" };
  }

  // Verificar fase actual
  const { data: config } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (!config) {
    return { error: "Error al verificar la configuración del evento" };
  }

  const now = new Date();
  const curationEnd = new Date(config.curation_end);
  const votingEnd = new Date(config.voting_end);

  // Verificar que estamos en fase de votación
  if (config.force_phase && config.force_phase !== "voting") {
    return { error: "La votación no está disponible en este momento" };
  }

  if (!config.force_phase && (now < curationEnd || now >= votingEnd)) {
    return { error: "La votación no está disponible en este momento" };
  }

  // Verificar que el usuario no ha votado en esta categoría
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("category_id", categoryId)
    .single();

  if (existingVote) {
    return { error: "Ya has votado en esta categoría" };
  }

  // Verificar que el finalista existe
  const { data: finalist } = await supabase
    .from("finalists")
    .select("id, category_id")
    .eq("id", finalistId)
    .single();

  if (!finalist || finalist.category_id !== categoryId) {
    return { error: "Finalista no válido" };
  }

  // Insertar voto (el trigger incrementará vote_count automáticamente)
  const { error: insertError } = await supabase.from("votes").insert({
    user_id: user.id,
    finalist_id: finalistId,
    category_id: categoryId,
  });

  if (insertError) {
    console.error("Error inserting vote:", insertError);
    return { error: "Error al guardar el voto" };
  }

  revalidatePath("/votar");
  return { success: true };
}

export async function getFinalistsByCategory() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("finalists")
    .select("*, category:categories(*)")
    .order("category_id", { ascending: true });

  if (error) {
    console.error("Error fetching finalists:", error);
    return [];
  }

  return data;
}

export async function getUserVotes(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user votes:", error);
    return [];
  }

  return data;
}

export async function getRevealedFinalists() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("finalists")
    .select("*, category:categories(*)")
    .eq("is_revealed", true)
    .order("revealed_at", { ascending: false });

  if (error) {
    console.error("Error fetching revealed finalists:", error);
    return [];
  }

  return data;
}
