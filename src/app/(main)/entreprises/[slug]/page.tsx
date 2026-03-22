import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntrepriseBySlug } from "@/modules/entreprises/server/actions";
import { EntrepriseProfileView } from "@/modules/entreprises/ui/views/entreprise-profile-view";

interface EntreprisePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: EntreprisePageProps): Promise<Metadata> {
  const { slug } = await params;
  let entreprise: Awaited<ReturnType<typeof getEntrepriseBySlug>> = null;

  try {
    entreprise = await getEntrepriseBySlug(slug);
  } catch {
    return { title: "Entreprise" };
  }

  if (!entreprise) return { title: "Entreprise introuvable" };

  return {
    title: entreprise.nom,
    description:
      entreprise.description ||
      `Découvrez ${entreprise.nom} à ${entreprise.ville} sur BizConnect Cameroun`,
    openGraph: {
      title: entreprise.nom,
      description:
        entreprise.description ||
        `${entreprise.nom} — ${entreprise.ville}`,
      images: entreprise.coverUrl ? [entreprise.coverUrl] : [],
    },
  };
}

export default async function EntreprisePage({ params }: EntreprisePageProps) {
  const { slug } = await params;
  let entreprise: Awaited<ReturnType<typeof getEntrepriseBySlug>> = null;

  try {
    entreprise = await getEntrepriseBySlug(slug);
  } catch {
    notFound();
  }

  if (!entreprise) notFound();

  return <EntrepriseProfileView entreprise={entreprise} />;
}
