import type { Metadata } from "next";
import { searchEntreprises, getAllCategories } from "@/modules/entreprises/server/actions";
import { EntrepriseCard } from "@/modules/entreprises/ui/components/entreprise-card";
import { SearchBar } from "@/modules/entreprises/ui/components/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Toutes les entreprises",
  description:
    "Parcourez notre annuaire d'entreprises de services à Douala et dans tout le Cameroun.",
};

interface EntreprisesPageProps {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    ville?: string;
    page?: string;
  }>;
}

export default async function EntreprisesPage({ searchParams }: EntreprisesPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const ville = params.ville || "";
  const page = parseInt(params.page || "1", 10);

  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  let categorieId: string | undefined;

  try {
    categories = await getAllCategories();
    if (params.cat) {
      const found = categories.find((c) => c.slug === params.cat);
      if (found) categorieId = found.id;
    }
  } catch {
    // DB not ready
  }

  let result: Awaited<ReturnType<typeof searchEntreprises>> = {
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  };

  try {
    result = await searchEntreprises({
      query: query || undefined,
      categorieId,
      ville: ville || undefined,
      page,
      limit: 12,
    });
  } catch {
    // DB not ready
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header — Editorial minimal */}
      <div className="bg-muted/30 border-b border-border pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo mb-3">
            Annuaire professionnel
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground mb-4">
            Toutes les entreprises
          </h1>
          <p className="text-muted-foreground mb-10 max-w-xl">
            {result.total > 0
              ? `${result.total} entreprise${result.total > 1 ? "s" : ""} trouvée${result.total > 1 ? "s" : ""}`
              : "Recherchez parmi nos entreprises partenaires"}
          </p>

          <SearchBar
            defaultQuery={query}
            defaultVille={ville}
            showVille
            className="max-w-3xl"
          />

          {/* Category filters — Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-8">
              <span className="text-xs font-medium text-muted-foreground mr-2">Filtrer par :</span>
              <a
                href="/entreprises"
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !params.cat
                    ? "bg-foreground text-background"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                Toutes
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/entreprises?cat=${cat.slug}${query ? `&q=${query}` : ""}${ville ? `&ville=${ville}` : ""}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    params.cat === cat.slug
                      ? "bg-foreground text-background"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {cat.nom}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {result.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {result.data.map((e) => (
                <EntrepriseCard key={e.id} entreprise={e} />
              ))}
            </div>

            {/* Pagination — Minimal blocks */}
            {result.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16 border-t border-border pt-8">
                {Array.from({ length: result.totalPages }).map((_, i) => (
                  <a
                    key={i}
                    href={`/entreprises?page=${i + 1}${query ? `&q=${query}` : ""}${params.cat ? `&cat=${params.cat}` : ""}${ville ? `&ville=${ville}` : ""}`}
                    className={`min-w-[40px] h-10 px-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      page === i + 1
                        ? "bg-foreground text-background"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {i + 1}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="py-20 border border-dashed border-border rounded-xl">
            <EmptyState
              icon="search"
              title="Aucune entreprise trouvée"
              description="Essayez de modifier vos critères de recherche ou explorez nos catégories."
            />
          </div>
        )}
      </div>
    </div>
  );
}
