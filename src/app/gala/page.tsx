import { createClient } from "@/lib/supabase/server";
import { GalaPublicClient } from "./gala-public-client";

export default async function GalaPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  const { data: finalists } = await supabase
    .from("finalists")
    .select("*")
    .order("final_position");

  const { data: config } = await supabase
    .from("event_config")
    .select("gala_active, special_category_title")
    .eq("id", 1)
    .single();

  return (
    <GalaPublicClient
      categories={categories || []}
      initialFinalists={finalists || []}
      isGalaActive={config?.gala_active || false}
      specialCategoryTitle={config?.special_category_title}
    />
  );
}
