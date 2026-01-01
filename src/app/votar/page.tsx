import { createClient } from "@/lib/supabase/server";
import { VotingClient } from "./voting-client";

export default async function VotarPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  const { data: finalists } = await supabase
    .from("finalists")
    .select("*")
    
  return (
    <VotingClient categories={categories || []} finalists={finalists || []} />
  );
}
