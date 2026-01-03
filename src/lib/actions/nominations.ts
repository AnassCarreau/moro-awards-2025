"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractTwitterHandle } from "@/lib/utils";
import type { NominationMode } from "@/types/database";

interface NominationInput {
  categoryId: number;
  mode: NominationMode;
  nominatedUser?: string;
  nominatedLink?: string;
  nominatedText?: string;
  isDeletedContent?: boolean;
}

export async function createNomination(input: NominationInput) {
  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Debes iniciar sesión para nominar" };
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
  const nominationsEnd = new Date(config.nominations_end);

  if (config.force_phase && config.force_phase !== "nominations") {
    return { error: "Las nominaciones están cerradas" };
  }

  if (!config.force_phase && now >= nominationsEnd) {
    return { error: "Las nominaciones están cerradas" };
  }

  // Validar datos según el modo
  const nominationData: {
    category_id: number;
    user_id: string;
    nominated_user?: string;
    nominated_link?: string;
    nominated_text?: string;
    is_deleted_content: boolean;
  } = {
    category_id: input.categoryId,
    user_id: user.id,
    is_deleted_content: input.isDeletedContent ?? false,
  };

  switch (input.mode) {
    case "user":
      if (!input.nominatedUser?.trim()) {
        return { error: "Debes introducir un usuario" };
      }
      nominationData.nominated_user =
        extractTwitterHandle(input.nominatedUser) || input.nominatedUser.trim();
      break;

    case "link":
      if (input.isDeletedContent) {
        if (!input.nominatedText?.trim()) {
          return { error: "Debes describir el contenido borrado" };
        }
        nominationData.nominated_text = input.nominatedText.trim();
      } else {
        if (!input.nominatedLink?.trim()) {
          return { error: "Debes introducir un enlace" };
        }
        nominationData.nominated_link = input.nominatedLink.trim();
      }
      break;

    case "text":
      if (!input.nominatedText?.trim()) {
        return { error: "Debes introducir una descripción" };
      }
      nominationData.nominated_text = input.nominatedText.trim();
      break;

    case "link_or_text":
      if (!input.nominatedLink?.trim() && !input.nominatedText?.trim()) {
        return { error: "Debes introducir un enlace o una descripción" };
      }
      if (input.nominatedLink?.trim()) {
        nominationData.nominated_link = input.nominatedLink.trim();
      }
      if (input.nominatedText?.trim()) {
        nominationData.nominated_text = input.nominatedText.trim();
      }
      break;
  }

  // Insertar nominación
  const { error: insertError } = await supabase
    .from("nominations")
    .insert(nominationData);

  if (insertError) {
    console.error("Error inserting nomination:", insertError);
    return { error: "Error al guardar la nominación" };
  }

  revalidatePath("/nominar");
  return { success: true };
}

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function getUserNominations(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nominations")
    .select("*, category:categories(*)")
    .eq("user_id", userId)
    .order("category_id", { ascending: true });

  if (error) {
    console.error("Error fetching user nominations:", error);
    return [];
  }

  return data;
}
