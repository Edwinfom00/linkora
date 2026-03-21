import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyEntreprise } from "@/modules/entreprises/server/actions";
import { getAvisByEntreprise, getAvisStats } from "@/modules/avis/server/actions";
import { StarRating } from "@/components/shared/star-rating";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Avis clients",
  description: "Consultez les avis laissés par vos clients.",
};

export default async function AvisPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const entreprise = await getMyEntreprise();
  if (!entreprise) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Créez d&apos;abord votre profil entreprise.
        </p>
      </div>
    );
  }

  const [avisList, stats] = await Promise.all([
    getAvisByEntreprise(entreprise.id),
    getAvisStats(entreprise.id),
  ]);

  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground">
        Avis clients
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-card border border-border text-center">
          <p className="text-5xl font-bold font-mono text-foreground">
            {stats.moyenne > 0 ? stats.moyenne.toFixed(1) : "—"}
          </p>
          <StarRating
            rating={stats.moyenne}
            className="justify-center mt-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {stats.total} avis au total
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-2.5">
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-4 text-right">
                {n}
              </span>
              <Star className="w-3 h-3 fill-amber text-amber" />
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full transition-all"
                  style={{
                    width: `${(stats.distribution[n as 1 | 2 | 3 | 4 | 5] / maxDist) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6">
                {stats.distribution[n as 1 | 2 | 3 | 4 | 5]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {avisList.length > 0 ? (
          avisList.map((a) => {
            const initials = a.clientName
              ? a.clientName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "??";

            return (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-indigo/20 to-cyan/20 text-indigo text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {a.clientName || "Anonyme"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <StarRating rating={a.note} size="sm" className="mt-1" />
                    {a.commentaire && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {a.commentaire}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun avis pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
