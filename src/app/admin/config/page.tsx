import { createClient } from "@/lib/supabase/server";
import { ConfigClient } from "./config-client";

export default async function ConfigPage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  return <ConfigClient initialConfig={config} />;
}
