import { createClient } from "@/lib/supabase/server";
import { calculatePhase } from "@/lib/phases";
import { HomeContent } from "./HomeContent";

export const revalidate = 30;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  const phaseInfo = config ? calculatePhase(config) : null;

  return <HomeContent initialPhaseInfo={phaseInfo} />;
}
