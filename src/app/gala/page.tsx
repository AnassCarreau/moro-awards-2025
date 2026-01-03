import { createClient } from "@/lib/supabase/server";
import { calculatePhase } from "@/lib/phases";
import { GalaContent } from "./GalaContent";
import { Card, CardContent } from "@/components/ui/Card";
import { Clock, Award } from "lucide-react";

export default async function GalaPage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Award className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-dark-400">Error al cargar la configuración</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const phaseInfo = calculatePhase(config);

  // Si no es fase gala o results, mostrar mensaje de espera
  if (phaseInfo.phase !== "gala" && phaseInfo.phase !== "results") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              La Gala Aún No Ha Comenzado
            </h1>
            <p className="text-dark-400">
              Vuelve cuando la ceremonia esté en directo para ver los ganadores
              revelados en tiempo real.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Obtener finalistas revelados iniciales
  const { data: revealedFinalists } = await supabase
    .from("finalists")
    .select("*, category:categories(*)")
    .eq("is_revealed", true)
    .order("revealed_at", { ascending: false });

  return (
    <GalaContent
      initialFinalists={revealedFinalists || []}
      isLive={phaseInfo.isLive}
      isResults={phaseInfo.phase === "results"}
    />
  );
}
