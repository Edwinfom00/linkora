import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { getMyEntreprise } from "@/modules/entreprises/server/actions";
import { getDashboardStats, getRecentContacts, getRecentAvis } from "@/modules/dashboard/server/actions";
import { StarRating } from "@/components/shared/star-rating";

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
      <div className="max-w-md mx-auto text-center py-20 bg-white border border-gray-200 rounded-md shadow-sm mt-10 p-8">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-6 h-6 text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Configurez votre entreprise
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Complétez votre profil entreprise pour accéder au tableau de bord.
        </p>
        <a
          href="/dashboard/profil"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
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
      variation: "+12%",
      isPositive: true,
    },
    {
      label: "Contacts",
      value: stats.totalContacts,
      icon: MessageSquare,
      variation: "+5%",
      isPositive: true,
    },
    {
      label: "Note moyenne",
      value: stats.noteMoyenne > 0 ? stats.noteMoyenne.toFixed(1) : "—",
      icon: Star,
      variation: "+0.2",
      isPositive: true,
    },
    {
      label: "Total avis",
      value: stats.totalAvis,
      icon: TrendingUp,
      variation: "+2",
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Bonjour, {entreprise.nom}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Voici un aperçu de votre activité
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-md p-4 shadow-sm"
          >
            <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-blue-600" strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-3">
              {stat.value}
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.variation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sections Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contacts récents */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Contacts récents</h3>
            <a href="/messages" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Tout voir</a>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => {
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
                    className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center font-semibold text-gray-600 text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.clientName || "Anonyme"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(contact.lastMessageAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center bg-gray-50/50">
                <p className="text-sm text-gray-500">Aucun contact récent</p>
              </div>
            )}
          </div>
        </div>

        {/* Avis récents */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Avis récents</h3>
            <a href="/dashboard/avis" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Tout voir</a>
          </div>

          <div className="divide-y divide-gray-50">
            {recentAvis.length > 0 ? (
              recentAvis.map((review) => {
                const initials = review.clientName
                  ? review.clientName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "??";

                return (
                  <div key={review.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center font-semibold text-gray-600 text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {review.clientName || "Anonyme"}
                        </p>
                        <StarRating rating={review.note} size="sm" />
                      </div>
                      {review.commentaire && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {review.commentaire}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center bg-gray-50/50">
                <p className="text-sm text-gray-500">Aucun avis récent</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
