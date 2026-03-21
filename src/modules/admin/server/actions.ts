"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth.schema";
import { entreprises } from "@/lib/db/schema/entreprises.schema";
import { categories } from "@/lib/db/schema/categories.schema";
import { avis } from "@/lib/db/schema/avis.schema";
import { messages } from "@/lib/db/schema/messages.schema";
import { eq, count, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  const [usersCount, entreprisesCount, avisCount, messagesCount] =
    await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(entreprises),
      db.select({ count: count() }).from(avis),
      db.select({ count: count() }).from(messages),
    ]);

  return {
    totalUsers: Number(usersCount[0]?.count) || 0,
    totalEntreprises: Number(entreprisesCount[0]?.count) || 0,
    totalAvis: Number(avisCount[0]?.count) || 0,
    totalMessages: Number(messagesCount[0]?.count) || 0,
  };
}

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
}

export async function getAllEntreprises() {
  return db
    .select({
      id: entreprises.id,
      nom: entreprises.nom,
      slug: entreprises.slug,
      ville: entreprises.ville,
      isVerified: entreprises.isVerified,
      isActive: entreprises.isActive,
      createdAt: entreprises.createdAt,
    })
    .from(entreprises)
    .orderBy(desc(entreprises.createdAt));
}

export async function toggleEntrepriseVerified(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return { error: "Non autorisé" };
  }

  const existing = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.id, id))
    .limit(1);

  if (!existing[0]) return { error: "Entreprise non trouvée" };

  await db
    .update(entreprises)
    .set({ isVerified: !existing[0].isVerified })
    .where(eq(entreprises.id, id));

  revalidatePath("/admin/entreprises");
  return { data: { success: true } };
}

export async function toggleEntrepriseActive(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return { error: "Non autorisé" };
  }

  const existing = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.id, id))
    .limit(1);

  if (!existing[0]) return { error: "Entreprise non trouvée" };

  await db
    .update(entreprises)
    .set({ isActive: !existing[0].isActive })
    .where(eq(entreprises.id, id));

  revalidatePath("/admin/entreprises");
  return { data: { success: true } };
}

export async function createCategory(data: { nom: string; icon?: string; couleur?: string; description?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return { error: "Non autorisé" };
  }

  const slug = data.nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  try {
    const result = await db
      .insert(categories)
      .values({
        nom: data.nom,
        slug,
        icon: data.icon || null,
        couleur: data.couleur || "#6366F1",
        description: data.description || null,
      })
      .returning();

    revalidatePath("/admin");
    return { data: result[0] };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur" };
  }
}

export async function getAllCategoriesAdmin() {
  return db.select().from(categories).orderBy(categories.nom);
}

export async function deleteCategory(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return { error: "Non autorisé" };
  }

  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin");
  return { data: { success: true } };
}
