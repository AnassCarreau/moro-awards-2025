import { createClient } from "@/lib/supabase/server";
import { calculatePhase, canVote } from "@/lib/phases";
import { getFinalistsByCategory, getUserVotes } from "@/lib/actions/votes";
import { CategoryVoting } from "@/components/voting/CategoryVoting";
import { Card, CardContent } from "@/components/ui/Card";
import { AlertCircle, Vote } from "lucide-react";
import type { Category, Finalist, Vote as VoteType } from "@/types/database";

export default async function VotarPage() {
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

  if (!canVote(phaseInfo.phase)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Vote className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Votación No Disponible
            </h1>
            <p className="text-dark-400">
              {phaseInfo.phase === "nominations" ||
              phaseInfo.phase === "curation"
                ? "La votación aún no ha comenzado. ¡Vuelve pronto!"
                : "La votación ha terminado. ¡Gracias por participar!"}
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
              Debes iniciar sesión con Google para poder votar
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Obtener finalistas y votos del usuario
  const [finalistsData, userVotes] = await Promise.all([
    getFinalistsByCategory(),
    getUserVotes(user.id),
  ]);

  // Agrupar finalistas por categoría
  const finalistsByCategory = finalistsData.reduce((acc, finalist) => {
    const categoryId = finalist.category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: finalist.category as Category,
        finalists: [],
      };
    }
    acc[categoryId].finalists.push(finalist);
    return acc;
  }, {} as Record<number, { category: Category; finalists: Finalist[] }>);

  // Crear mapa de votos del usuario
  const userVotesByCategory = userVotes.reduce((acc, vote) => {
    acc[vote.category_id] = vote;
    return acc;
  }, {} as Record<number, VoteType>);

  const categoriesWithFinalists = Object.values(finalistsByCategory) as Array<{
    category: Category;
    finalists: Finalist[];
  }>;

  categoriesWithFinalists.sort(
    (a, b) => a.category.display_order - b.category.display_order
  );

  if (categoriesWithFinalists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Vote className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Sin Finalistas
            </h1>
            <p className="text-dark-400">
              Aún no hay finalistas disponibles para votar. ¡Vuelve más tarde!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-gold mb-4">
            Votación Final
          </h1>
          <p className="text-dark-400 text-lg">
            Elige a tus favoritos en cada categoría. Solo puedes votar una vez
            por categoría.
          </p>
        </div>

        <div className="space-y-6">
          {categoriesWithFinalists.map(({ category, finalists }) => (
            <CategoryVoting
              key={category.id}
              category={category}
              finalists={finalists}
              userVote={userVotesByCategory[category.id] || null}
            />
          ))}
        </div>
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
