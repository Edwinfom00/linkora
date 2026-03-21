import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Building2,
  Wrench,
  Truck,
  Utensils,
  GraduationCap,
  Heart,
  Briefcase,
  Zap,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  MessageSquare,
  Star,
  Users,
  Shield,
  TrendingUp,
} from "lucide-react";
import { SearchBar } from "@/modules/entreprises/ui/components/search-bar";
import { EntrepriseCard } from "@/modules/entreprises/ui/components/entreprise-card";
import { getEntreprisesRecentes, getAllCategories } from "@/modules/entreprises/server/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "BizConnect Cameroun — Trouvez les meilleures entreprises à Douala",
  description:
    "Recherchez et contactez les meilleurs professionnels et entreprises de services à Douala et dans tout le Cameroun.",
};

const defaultCategories = [
  { nom: "Construction", icon: "Building2", couleur: "#6366F1", slug: "construction" },
  { nom: "Réparation", icon: "Wrench", couleur: "#06B6D4", slug: "reparation" },
  { nom: "Transport", icon: "Truck", couleur: "#10B981", slug: "transport" },
  { nom: "Restauration", icon: "Utensils", couleur: "#F59E0B", slug: "restauration" },
  { nom: "Éducation", icon: "GraduationCap", couleur: "#8B5CF6", slug: "education" },
  { nom: "Santé", icon: "Heart", couleur: "#EF4444", slug: "sante" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Wrench,
  Truck,
  Utensils,
  GraduationCap,
  Heart,
  Briefcase,
  Zap,
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
    // Database might not be set up yet, use empty arrays
  }

  const displayCategories =
    dbCategories.length > 0
      ? dbCategories.map((c) => ({
          nom: c.nom,
          icon: c.icon || "Building2",
          couleur: c.couleur || "#6366F1",
          slug: c.slug,
        }))
      : defaultCategories;

  return (
    <>
      {/* ======== HERO ======== */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#08080F]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.3), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6, 182, 212, 0.15), transparent), radial-gradient(ellipse 50% 30% at 10% 80%, rgba(16, 185, 129, 0.1), transparent)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-full px-4 py-1.5 text-[13px] text-white/60 animate-slide-up">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                La plateforme #1 au Cameroun
              </div>

              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold font-[family-name:var(--font-display)] text-white leading-[1.1] tracking-tight animate-slide-up">
                Trouvez les meilleures{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo via-cyan to-emerald bg-clip-text text-transparent">
                    entreprises
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-cyan/30"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M1 8.5C32 2.5 62 1.5 101 5.5C140 9.5 170 8.5 199 3.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                à Douala
              </h1>

              <p className="text-lg text-white/50 max-w-lg leading-relaxed animate-slide-up">
                Recherchez, comparez et contactez les meilleurs professionnels
                et entreprises de services au Cameroun. En quelques clics.
              </p>

              {/* Search */}
              <div className="animate-slide-up">
                <SearchBar showVille />
              </div>

              {/* Stats row – glass cards */}
              <div className="flex items-center gap-5 sm:gap-8 pt-2 animate-slide-up">
                {[
                  { value: "500+", label: "Entreprises" },
                  { value: "10K+", label: "Clients actifs" },
                  { value: "4.8", label: "Note moyenne" },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    {i > 0 && (
                      <div className="w-px h-8 bg-white/10" />
                    )}
                    <div className={i > 0 ? "pl-3 sm:pl-5" : ""}>
                      <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-white/40 uppercase tracking-widest">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual bento grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 animate-slide-up">
              {/* Big card */}
              <div className="col-span-2 h-44 rounded-xl overflow-hidden relative group border border-white/[0.06] bg-gradient-to-br from-indigo/20 via-indigo/5 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo/10 to-transparent group-hover:from-indigo/20 transition-all duration-500" />
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-indigo/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-indigo" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40">Croissance</p>
                    <p className="text-2xl font-bold font-mono text-white">+127%</p>
                    <p className="text-xs text-white/30">d&apos;entreprises ce mois</p>
                  </div>
                </div>
              </div>

              {/* Small card 1 */}
              <div className="h-36 rounded-xl overflow-hidden relative border border-white/[0.06] bg-gradient-to-br from-cyan/10 via-transparent to-transparent">
                <div className="p-5 flex flex-col justify-between h-full">
                  <div className="w-9 h-9 rounded-lg bg-cyan/15 flex items-center justify-center">
                    <Users className="w-4 h-4 text-cyan" />
                  </div>
                  <div>
                    <p className="text-xl font-bold font-mono text-white">10K+</p>
                    <p className="text-xs text-white/40">Clients satisfaits</p>
                  </div>
                </div>
              </div>

              {/* Small card 2 */}
              <div className="h-36 rounded-xl overflow-hidden relative border border-white/[0.06] bg-gradient-to-br from-emerald/10 via-transparent to-transparent">
                <div className="p-5 flex flex-col justify-between h-full">
                  <div className="w-9 h-9 rounded-lg bg-emerald/15 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald" />
                  </div>
                  <div>
                    <p className="text-xl font-bold font-mono text-white">100%</p>
                    <p className="text-xs text-white/40">Entreprises vérifiées</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle gradient bleed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ======== CATEGORIES ======== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo mb-2">
                Catégories
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
                Explorer par secteur
              </h2>
            </div>
            <Link
              href="/entreprises"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
            {displayCategories.map((cat) => {
              const CategoryIcon = iconMap[cat.icon] || Building2;
              return (
                <Link
                  key={cat.slug}
                  href={`/entreprises?cat=${cat.slug}`}
                  className="group relative flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/60 hover:border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.couleur}12` }}
                  >
                    <CategoryIcon
                      className="w-6 h-6"
                      style={{ color: cat.couleur }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">
                    {cat.nom}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== FEATURED ENTREPRISES ======== */}
      <section className="py-20 md:py-28 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-2">
                Populaires
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
                Entreprises en vedette
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden sm:inline-flex rounded-lg border-border gap-2 text-sm"
            >
              <Link href="/entreprises">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {entreprisesRecentes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {entreprisesRecentes.map((e) => (
                <EntrepriseCard key={e.id} entreprise={e} />
              ))}
            </div>
          ) : (
            <div className="py-20 border border-dashed border-border rounded-xl">
              <div className="text-center max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-xl bg-indigo/10 flex items-center justify-center mx-auto mb-5">
                  <Building2 className="w-8 h-8 text-indigo" />
                </div>
                <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] mb-2">
                  Aucune entreprise pour le moment
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Soyez le premier à référencer votre entreprise sur BizConnect Cameroun
                </p>
                <Button
                  asChild
                  className="rounded-lg bg-indigo hover:bg-indigo/90 text-white"
                >
                  <Link href="/register">Référencer mon entreprise</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-8 sm:hidden">
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-border gap-2"
            >
              <Link href="/entreprises">
                Voir toutes les entreprises
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald mb-2">
              Simple & efficace
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
              Comment ça marche
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
            {[
              {
                step: "01",
                icon: Search,
                title: "Recherchez",
                description:
                  "Explorez notre annuaire par catégorie, localisation ou mot-clé.",
                color: "#6366F1",
              },
              {
                step: "02",
                icon: Star,
                title: "Comparez",
                description:
                  "Consultez les profils, avis clients et services pour faire le bon choix.",
                color: "#06B6D4",
              },
              {
                step: "03",
                icon: MessageSquare,
                title: "Contactez",
                description:
                  "Envoyez un message directement et obtenez une réponse rapide.",
                color: "#10B981",
              },
            ].map((item) => (
              <div key={item.step} className="bg-card p-8 md:p-10 group">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-5xl font-bold font-mono text-border group-hover:text-muted-foreground/30 transition-colors">
                    {item.step}
                  </span>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== TRUST BAR ======== */}
      <section className="py-10 bg-muted/30 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Shield, value: "Vérifié", desc: "Toutes les entreprises" },
              { icon: Star, value: "4.8/5", desc: "Satisfaction client" },
              { icon: Zap, value: "< 2h", desc: "Temps de réponse" },
              { icon: Users, value: "10K+", desc: "Utilisateurs actifs" },
            ].map((item) => (
              <div key={item.desc} className="flex flex-col items-center gap-2">
                <item.icon className="w-5 h-5 text-muted-foreground/60" />
                <p className="text-lg font-bold font-mono text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="relative overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-[#08080F]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(99, 102, 241, 0.2), transparent), radial-gradient(ellipse 40% 40% at 100% 0%, rgba(6, 182, 212, 0.1), transparent)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo/70 mb-4">
            Pour les entreprises
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white mb-5 leading-tight">
            Développez votre activité avec BizConnect
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
            Référencez votre entreprise gratuitement et recevez des demandes
            de clients qualifiés chaque jour.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="h-12 px-8 rounded-lg bg-white text-[#08080F] hover:bg-white/90 font-semibold text-sm transition-all gap-2"
            >
              <Link href="/register">
                Référencer mon entreprise
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 rounded-lg border-white/15 text-white/70 hover:text-white hover:bg-white/5 font-medium text-sm transition-all gap-2"
            >
              <Link href="/entreprises">
                Explorer les entreprises
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
