"use server";

import { db } from "@/lib/db";
import { entreprises } from "@/lib/db/schema/entreprises.schema";
import { categories } from "@/lib/db/schema/categories.schema";
import { avis } from "@/lib/db/schema/avis.schema";
import { services } from "@/lib/db/schema/services.schema";
import { users } from "@/lib/db/schema/auth.schema";
import { medias } from "@/lib/db/schema/medias.schema";
import { eq, and, ilike, sql, desc, avg, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { entrepriseSchema, searchSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export interface EntrepriseWithDetails {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  ville: string;
  quartier: string | null;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  siteWeb: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  categorieId: string | null;
  categorie: { id: string; nom: string; slug: string; icon: string | null; couleur: string | null } | null;
  noteMoyenne: number;
  totalAvis: number;
}

export interface SearchResult {
  data: EntrepriseWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}

export async function searchEntreprises(params: unknown): Promise<SearchResult> {
  const parsed = searchSchema.safeParse(params);
  if (!parsed.success) {
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }

  const { query, categorieId, ville, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const conditions = [eq(entreprises.isActive, true)];
  if (query) {
    conditions.push(ilike(entreprises.nom, `%${query}%`));
  }
  if (categorieId) {
    conditions.push(eq(entreprises.categorieId, categorieId));
  }
  if (ville) {
    conditions.push(eq(entreprises.ville, ville));
  }

  const whereClause = and(...conditions);

  const results = await db
    .select({
      id: entreprises.id,
      nom: entreprises.nom,
      slug: entreprises.slug,
      description: entreprises.description,
      ville: entreprises.ville,
      quartier: entreprises.quartier,
      adresse: entreprises.adresse,
      telephone: entreprises.telephone,
      email: entreprises.email,
      siteWeb: entreprises.siteWeb,
      logoUrl: entreprises.logoUrl,
      coverUrl: entreprises.coverUrl,
      isVerified: entreprises.isVerified,
      isActive: entreprises.isActive,
      createdAt: entreprises.createdAt,
      categorieId: entreprises.categorieId,
      categorieNom: categories.nom,
      categorieSlug: categories.slug,
      categorieIcon: categories.icon,
      categorieCouleur: categories.couleur,
      noteMoyenne: avg(avis.note),
      totalAvis: count(avis.id),
    })
    .from(entreprises)
    .leftJoin(categories, eq(entreprises.categorieId, categories.id))
    .leftJoin(avis, eq(entreprises.id, avis.entrepriseId))
    .where(whereClause)
    .groupBy(
      entreprises.id,
      categories.id,
      categories.nom,
      categories.slug,
      categories.icon,
      categories.couleur
    )
    .orderBy(desc(entreprises.createdAt))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: count() })
    .from(entreprises)
    .where(whereClause);

  const total = totalResult[0]?.count || 0;

  const data: EntrepriseWithDetails[] = results.map((r) => ({
    id: r.id,
    nom: r.nom,
    slug: r.slug,
    description: r.description,
    ville: r.ville,
    quartier: r.quartier,
    adresse: r.adresse,
    telephone: r.telephone,
    email: r.email,
    siteWeb: r.siteWeb,
    logoUrl: r.logoUrl,
    coverUrl: r.coverUrl,
    isVerified: r.isVerified,
    isActive: r.isActive,
    createdAt: r.createdAt,
    categorieId: r.categorieId,
    categorie: r.categorieNom
      ? {
          id: r.categorieId || "",
          nom: r.categorieNom,
          slug: r.categorieSlug || "",
          icon: r.categorieIcon,
          couleur: r.categorieCouleur,
        }
      : null,
    noteMoyenne: Number(r.noteMoyenne) || 0,
    totalAvis: Number(r.totalAvis) || 0,
  }));

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getEntreprisesRecentes(limit: number = 6) {
  const results = await db
    .select({
      id: entreprises.id,
      nom: entreprises.nom,
      slug: entreprises.slug,
      description: entreprises.description,
      ville: entreprises.ville,
      quartier: entreprises.quartier,
      logoUrl: entreprises.logoUrl,
      coverUrl: entreprises.coverUrl,
      isVerified: entreprises.isVerified,
      categorieId: entreprises.categorieId,
      categorieNom: categories.nom,
      categorieSlug: categories.slug,
      categorieIcon: categories.icon,
      categorieCouleur: categories.couleur,
      createdAt: entreprises.createdAt,
      noteMoyenne: avg(avis.note),
      totalAvis: count(avis.id),
    })
    .from(entreprises)
    .leftJoin(categories, eq(entreprises.categorieId, categories.id))
    .leftJoin(avis, eq(entreprises.id, avis.entrepriseId))
    .where(eq(entreprises.isActive, true))
    .groupBy(
      entreprises.id,
      categories.id,
      categories.nom,
      categories.slug,
      categories.icon,
      categories.couleur
    )
    .orderBy(desc(entreprises.createdAt))
    .limit(limit);

  return results.map((r) => ({
    id: r.id,
    nom: r.nom,
    slug: r.slug,
    description: r.description,
    ville: r.ville,
    quartier: r.quartier,
    logoUrl: r.logoUrl,
    coverUrl: r.coverUrl,
    isVerified: r.isVerified,
    categorieId: r.categorieId,
    createdAt: r.createdAt,
    categorie: r.categorieNom
      ? {
          id: r.categorieId || "",
          nom: r.categorieNom,
          slug: r.categorieSlug || "",
          icon: r.categorieIcon,
          couleur: r.categorieCouleur,
        }
      : null,
    noteMoyenne: Number(r.noteMoyenne) || 0,
    totalAvis: Number(r.totalAvis) || 0,
  }));
}

export async function getEntrepriseBySlug(slug: string) {
  const result = await db
    .select()
    .from(entreprises)
    .where(and(eq(entreprises.slug, slug), eq(entreprises.isActive, true)))
    .limit(1);

  if (!result[0]) return null;

  const entreprise = result[0];

  const [categorieResult, servicesResult, avisResult, mediasResult] = await Promise.all([
    entreprise.categorieId
      ? db.select().from(categories).where(eq(categories.id, entreprise.categorieId)).limit(1)
      : Promise.resolve([]),
    db
      .select()
      .from(services)
      .where(and(eq(services.entrepriseId, entreprise.id), eq(services.isActive, true))),
    db
      .select({
        id: avis.id,
        note: avis.note,
        commentaire: avis.commentaire,
        createdAt: avis.createdAt,
        clientName: users.name,
        clientImage: users.image,
      })
      .from(avis)
      .leftJoin(users, eq(avis.clientId, users.id))
      .where(eq(avis.entrepriseId, entreprise.id))
      .orderBy(desc(avis.createdAt)),
    db
      .select()
      .from(medias)
      .where(eq(medias.entrepriseId, entreprise.id)),
  ]);

  const notesStats = avisResult.reduce(
    (acc, a) => {
      acc.total += 1;
      acc.sum += a.note;
      acc.distribution[a.note as 1 | 2 | 3 | 4 | 5] += 1;
      return acc;
    },
    {
      total: 0,
      sum: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
    }
  );

  return {
    ...entreprise,
    categorie: categorieResult[0] || null,
    services: servicesResult,
    avis: avisResult,
    medias: mediasResult,
    stats: {
      noteMoyenne: notesStats.total > 0 ? notesStats.sum / notesStats.total : 0,
      totalAvis: notesStats.total,
      distribution: notesStats.distribution,
    },
  };
}

export async function getMyEntreprise() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const result = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.userId, session.user.id))
    .limit(1);

  return result[0] || null;
}

export async function createEntreprise(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const parsed = entrepriseSchema.safeParse(data);
  if (!parsed.success) return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };

  const slug = parsed.data.nom
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now().toString(36);

  try {
    const result = await db
      .insert(entreprises)
      .values({
        userId: session.user.id,
        nom: parsed.data.nom,
        slug,
        description: parsed.data.description || null,
        ville: parsed.data.ville,
        quartier: parsed.data.quartier || null,
        adresse: parsed.data.adresse || null,
        telephone: parsed.data.telephone || null,
        email: parsed.data.email || null,
        siteWeb: parsed.data.siteWeb || null,
        categorieId: parsed.data.categorieId || null,
      })
      .returning();

    revalidatePath("/entreprises");
    revalidatePath("/dashboard");
    return { data: result[0] };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur lors de la création" };
  }
}

export async function updateEntreprise(id: string, data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const existing = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.id, id))
    .limit(1);

  if (!existing[0] || existing[0].userId !== session.user.id) {
    return { error: "Non autorisé" };
  }

  const parsed = entrepriseSchema.safeParse(data);
  if (!parsed.success) return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };

  try {
    await db
      .update(entreprises)
      .set({
        nom: parsed.data.nom,
        description: parsed.data.description || null,
        ville: parsed.data.ville,
        quartier: parsed.data.quartier || null,
        adresse: parsed.data.adresse || null,
        telephone: parsed.data.telephone || null,
        email: parsed.data.email || null,
        siteWeb: parsed.data.siteWeb || null,
        categorieId: parsed.data.categorieId || null,
        updatedAt: new Date(),
      })
      .where(eq(entreprises.id, id));

    revalidatePath("/entreprises");
    revalidatePath(`/entreprises/${existing[0].slug}`);
    revalidatePath("/dashboard");
    return { data: { success: true } };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur lors de la mise à jour" };
  }
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.nom);
}
