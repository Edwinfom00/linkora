import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyEntreprise, getAllCategories } from "@/modules/entreprises/server/actions";
import { ProfilFormView } from "@/modules/dashboard/ui/views/profil-form-view";

export const metadata: Metadata = {
  title: "Profil entreprise",
  description: "Modifiez les informations de votre entreprise.",
};

export default async function ProfilPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const [entreprise, categories] = await Promise.all([
    getMyEntreprise(),
    getAllCategories(),
  ]);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground mb-6">
        Profil entreprise
      </h2>
      <ProfilFormView entreprise={entreprise} categories={categories} />
    </div>
  );
}
