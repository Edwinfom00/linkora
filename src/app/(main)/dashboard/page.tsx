import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import { getMyEntreprise } from "@/modules/entreprises/server/actions";
import { getDashboardStats, getRecentContacts, getRecentAvis } from "@/modules/dashboard/server/actions";
import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Gérez votre entreprise sur BizConnect Cameroun.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const entreprise = await getMyEntreprise();
  if (!entreprise) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-xl bg-indigo/10 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-10 h-10 text-indigo" />
        </div>
        <h2 className="text-xl font-bold font-[family-name:var(--font-display)] mb-2">
          Configurez votre entreprise
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Complétez votre profil entreprise pour accéder au tableau de bord.
        </p>
        <a
          href="/dashboard/profil"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo text-white font-semibold hover:bg-indigo/90 transition-colors shadow-lg shadow-indigo/25"
        >
          Créer mon profil
        </a>
      </div>
    );
  }

  const [stats, recentContacts, recentAvis] = await Promise.all([
    getDashboardStats(entreprise.id),
    getRecentContacts(entreprise.id),
    getRecentAvis(entreprise.id),
  ]);

  const statCards = [
    {
      label: "Total vues",
      value: stats.totalVues,
      icon: Eye,
      color: "#6366F1",
      bg: "bg-indigo/10",
    },
    {
      label: "Contacts",
      value: stats.totalContacts,
      icon: MessageSquare,
      color: "#06B6D4",
      bg: "bg-cyan/10",
    },
    {
      label: "Note moyenne",
      value: stats.noteMoyenne > 0 ? stats.noteMoyenne.toFixed(1) : "—",
      icon: Star,
      color: "#F59E0B",
      bg: "bg-amber/10",
    },
    {
      label: "Total avis",
      value: stats.totalAvis,
      icon: TrendingUp,
      color: "#10B981",
      bg: "bg-emerald/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground">
          Bonjour, {entreprise.nom} 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Voici un aperçu de votre activité
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon
                  className="w-6 h-6"
                  style={{ color: stat.color }}
                />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground animate-count-up">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
          <h3 className="text-base font-semibold font-[family-name:var(--font-display)] text-foreground mb-4">
            Contacts récents
          </h3>
          {recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact) => {
                const initials = contact.clientName
                  ? contact.clientName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "??";

                return (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-gradient-to-br from-indigo/20 to-cyan/20 text-indigo text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {contact.clientName || "Anonyme"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(contact.lastMessageAt).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "short" }
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Aucun contact récent
            </p>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
          <h3 className="text-base font-semibold font-[family-name:var(--font-display)] text-foreground mb-4">
            Avis récents
          </h3>
          {recentAvis.length > 0 ? (
            <div className="space-y-3">
              {recentAvis.map((review) => (
                <div
                  key={review.id}
                  className="p-3 rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {review.clientName || "Anonyme"}
                    </p>
                    <StarRating rating={review.note} size="sm" />
                  </div>
                  {review.commentaire && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {review.commentaire}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Aucun avis récent
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
