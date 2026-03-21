import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllEntreprises } from "@/modules/admin/server/actions";
import { AdminEntreprisesView } from "@/modules/admin/ui/views/admin-entreprises-view";

export const metadata: Metadata = {
  title: "Entreprises — Admin",
};

export default async function AdminEntreprisesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  const entreprisesList = await getAllEntreprises();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
        Entreprises ({entreprisesList.length})
      </h2>

      <AdminEntreprisesView initialEntreprises={entreprisesList} />
    </div>
  );
}
