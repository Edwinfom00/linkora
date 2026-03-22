import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Wrench,
  Truck,
  Utensils,
  GraduationCap,
  Heart,
  ArrowRight,
  Search,
  Star,
  MessageSquare
} from "lucide-react";
import { SearchBar } from "@/modules/entreprises/ui/components/search-bar";
import { EntrepriseCard } from "@/modules/entreprises/ui/components/entreprise-card";
import { getEntreprisesRecentes, getAllCategories } from "@/modules/entreprises/server/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BizConnect Cameroun — Trouvez les meilleures entreprises à Douala",
  description: "Recherchez et contactez les meilleurs professionnels et entreprises de services à Douala et dans tout le Cameroun.",
};

const defaultCategories = [
  { nom: "Construction", icon: "Building2", slug: "construction" },
  { nom: "Réparation", icon: "Wrench", slug: "reparation" },
  { nom: "Transport", icon: "Truck", slug: "transport" },
  { nom: "Restauration", icon: "Utensils", slug: "restauration" },
  { nom: "Éducation", icon: "GraduationCap", slug: "education" },
  { nom: "Santé", icon: "Heart", slug: "sante" },
];

const iconMap: Record<string, typeof Building2> = {
  Building2,
  Wrench,
  Truck,
  Utensils,
  GraduationCap,
  Heart,
};

export default async function HomePage() {
  let entreprisesRecentes: Awaited<ReturnType<typeof getEntreprisesRecentes>> = [];
  let dbCategories: Awaited<ReturnType<typeof getAllCategories>> = [];

  try {
    [entreprisesRecentes, dbCategories] = await Promise.all([
      getEntreprisesRecentes(6),
      getAllCategories(),
    ]);
  } catch {
    //
  }

  const displayCategories = dbCategories.length > 0
    ? dbCategories.map((c) => ({
        nom: c.nom,
        icon: c.icon || "Building2",
        slug: c.slug,
      }))
    : defaultCategories;

  return (
    <>
      {/* ======== HERO ======== */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6 max-w-3xl">
            Trouvez les meilleures entreprises à Douala
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
            Recherchez, comparez et contactez les meilleurs professionnels et entreprises de services au Cameroun. En quelques clics.
          </p>
          
          <div className="w-full max-w-4xl mx-auto mb-8">
            <SearchBar showVille />
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-900 text-lg">500+</span>
              <span>Entreprises</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-900 text-lg">10K+</span>
              <span>Clients actifs</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-900 text-lg">4.8</span>
              <span>Note moyenne</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======== CATEGORIES ======== */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Explorer par secteur
            </h2>
            <Link href="/entreprises" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayCategories.map((cat) => {
              const CategoryIcon = iconMap[cat.icon] || Building2;
              return (
                <Link
                  key={cat.slug}
                  href={`/entreprises?cat=${cat.slug}`}
                  className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors duration-150"
                >
                  <CategoryIcon className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
                  <span className="text-sm font-medium text-gray-900 text-center">
                    {cat.nom}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== FEATURED ENTREPRISES ======== */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Entreprises en vedette
            </h2>
            <Link href="/entreprises" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir toutes les entreprises <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {entreprisesRecentes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entreprisesRecentes.map((e) => (
                <EntrepriseCard key={e.id} entreprise={e} />
              ))}
            </div>
          ) : (
            <div className="py-20 border border-gray-200 rounded-md text-center bg-gray-50 flex flex-col items-center">
              <Building2 className="w-8 h-8 text-gray-400 mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Aucune entreprise pour le moment</h3>
              <p className="text-sm text-gray-500 mb-6">Soyez le premier à référencer votre entreprise.</p>
              <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                Référencer mon entreprise
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-lg font-semibold text-gray-900">
              Comment ça marche
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] border-t border-dashed border-gray-300" />
            
            {[
              {
                step: "1",
                icon: Search,
                title: "Recherchez",
                description: "Explorez notre annuaire par catégorie, localisation ou mot-clé."
              },
              {
                step: "2",
                icon: Star,
                title: "Comparez",
                description: "Consultez les profils, avis clients et services pour faire le bon choix."
              },
              {
                step: "3",
                icon: MessageSquare,
                title: "Contactez",
                description: "Envoyez un message directement et obtenez une réponse rapide."
              }
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center z-10 mx-auto mb-4 relative drop-shadow-sm">
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold">
                    {item.step}
                  </span>
                  <item.icon className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
            Développez votre activité avec BizConnect
          </h2>
          <p className="text-sm text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Référencez votre entreprise gratuitement et recevez des demandes de clients qualifiés chaque jour.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 rounded-md transition-colors"
            >
              Référencer mon entreprise
            </Link>
            <Link
              href="/entreprises"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-gray-700 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              Explorer les entreprises
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
