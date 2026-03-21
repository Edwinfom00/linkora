import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Users, Building2, MessageSquare, Star } from "lucide-react";
import { getAdminStats, getAllCategoriesAdmin } from "@/modules/admin/server/actions";
import { AdminCategoriesView } from "@/modules/admin/ui/views/admin-categories-view";

export const metadata: Metadata = {
  title: "Administration",
  description: "Panneau d'administration BizConnect Cameroun.",
};

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  const [stats, categoriesList] = await Promise.all([
    getAdminStats(),
    getAllCategoriesAdmin(),
  ]);

  const statCards = [
    {
      label: "Utilisateurs",
      value: stats.totalUsers,
      icon: Users,
      color: "#6366F1",
      bg: "bg-indigo/10",
    },
    {
      label: "Entreprises",
      value: stats.totalEntreprises,
      icon: Building2,
      color: "#06B6D4",
      bg: "bg-cyan/10",
    },
    {
      label: "Avis",
      value: stats.totalAvis,
      icon: Star,
      color: "#F59E0B",
      bg: "bg-amber/10",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "#10B981",
      bg: "bg-emerald/10",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
        Vue d&apos;ensemble
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <p className="text-3xl font-bold font-mono text-foreground animate-count-up">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Categories Management */}
      <div>
        <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] mb-4">
          Gestion des catégories
        </h3>
        <AdminCategoriesView initialCategories={categoriesList} />
      </div>
    </div>
  );
}
