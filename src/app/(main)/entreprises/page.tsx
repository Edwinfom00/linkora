import type { Metadata } from "next";
import Link from "next/link";
import { searchEntreprises, getAllCategories } from "@/modules/entreprises/server/actions";
import { EntrepriseCard } from "@/modules/entreprises/ui/components/entreprise-card";
import { SearchBar } from "@/modules/entreprises/ui/components/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { MapPin, Star, Building2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Toutes les entreprises",
  description: "Parcourez notre annuaire d'entreprises de services à Douala et dans tout le Cameroun.",
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Sticky */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 w-full max-w-2xl">
            <SearchBar
              defaultQuery={query}
              defaultVille={ville}
              showVille
              className="w-full"
            />
          </div>
          
          <div className="hidden md:flex items-center text-xs text-gray-500 font-medium">
            <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-gray-900">Entreprises</span>
            {params.cat && (
              <>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span className="text-gray-900 capitalize">{params.cat}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 md:px-6 py-6 overflow-hidden">
        
        {/* Sidebar Filtres */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégories</h3>
              {(params.cat || query || ville) && (
                <Link href="/entreprises" className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
                  Réinitialiser
                </Link>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/entreprises?${query ? `q=${query}&` : ""}${ville ? `ville=${ville}` : ""}`}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  !params.cat
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Toutes
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/entreprises?cat=${cat.slug}${query ? `&q=${query}` : ""}${ville ? `&ville=${ville}` : ""}`}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    params.cat === cat.slug
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat.nom}
                </Link>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ville</h3>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  className="w-full h-9 pl-8 pr-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-700"
                  defaultValue={ville || ""}
                >
                  <option value="">Toutes les villes</option>
                  <option value="Douala">Douala</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Bafoussam">Bafoussam</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Note minimum</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className="p-1 hover:bg-gray-50 rounded text-gray-300 hover:text-yellow-400 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Grille Résultats */}
        <main className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {result.total} résultat{result.total > 1 ? "s" : ""}
            </h2>
          </div>

          {result.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.data.map((e) => (
                  <EntrepriseCard key={e.id} entreprise={e} />
                ))}
              </div>

              {/* Pagination */}
              {result.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-200">
                  {Array.from({ length: result.totalPages }).map((_, i) => (
                    <Link
                      key={i}
                      href={`/entreprises?page=${i + 1}${query ? `&q=${query}` : ""}${params.cat ? `&cat=${params.cat}` : ""}${ville ? `&ville=${ville}` : ""}`}
                      className={`min-w-[32px] h-8 px-2 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                        page === i + 1
                          ? "bg-blue-600 text-white border border-blue-600"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-md p-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-md text-gray-400 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Aucune entreprise trouvée</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-4">
                Essayez de modifier vos filtres ou de chercher avec d'autres mots-clés.
              </p>
              <Link 
                href="/entreprises"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
