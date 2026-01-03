import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculatePhase, canNominate } from "@/lib/phases";
import { getCategories } from "@/lib/actions/nominations";
import { NominationForm } from "@/components/nominations/NominationForm";
import { Card, CardContent } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";

export default async function NominarPage() {
  const supabase = await createClient();

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verificar fase
  const { data: config } = await supabase
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (!config) {
    return <ErrorMessage message="Error al cargar la configuración" />;
  }

  const phaseInfo = calculatePhase(config);

  if (!canNominate(phaseInfo.phase)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Nominaciones Cerradas
            </h1>
            <p className="text-dark-400">
              El período de nominaciones ha terminado. ¡Gracias por participar!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Inicia Sesión
            </h1>
            <p className="text-dark-400">
              Debes iniciar sesión con Google para poder nominar
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = await getCategories();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-gold mb-4">
            Nominaciones
          </h1>
          <p className="text-dark-400 text-lg">
            Propón a tus candidatos favoritos para los Moro TW Awards 2025
          </p>
        </div>

        <NominationForm categories={categories} />
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card variant="glass" className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-dark-400">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
