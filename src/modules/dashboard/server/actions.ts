"use server";

import { db } from "@/lib/db";
import { entreprises } from "@/lib/db/schema/entreprises.schema";
import { services } from "@/lib/db/schema/services.schema";
import { avis } from "@/lib/db/schema/avis.schema";
import { conversations } from "@/lib/db/schema/conversations.schema";
import { messages } from "@/lib/db/schema/messages.schema";
import { users } from "@/lib/db/schema/auth.schema";
import { eq, and, desc, avg, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { serviceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getDashboardStats(entrepriseId: string) {
  const [avisStats, contactsCount] = await Promise.all([
    db
      .select({
        moyenne: avg(avis.note),
        total: count(avis.id),
      })
      .from(avis)
      .where(eq(avis.entrepriseId, entrepriseId)),
    db
      .select({ count: count() })
      .from(conversations)
      .where(eq(conversations.entrepriseId, entrepriseId)),
  ]);

  return {
    totalVues: 0,
    totalContacts: Number(contactsCount[0]?.count) || 0,
    noteMoyenne: Number(avisStats[0]?.moyenne) || 0,
    totalAvis: Number(avisStats[0]?.total) || 0,
  };
}

export async function getRecentContacts(entrepriseId: string) {
  return db
    .select({
      id: conversations.id,
      clientName: users.name,
      clientImage: users.image,
      lastMessageAt: conversations.lastMessageAt,
    })
    .from(conversations)
    .leftJoin(users, eq(conversations.clientId, users.id))
    .where(eq(conversations.entrepriseId, entrepriseId))
    .orderBy(desc(conversations.lastMessageAt))
    .limit(5);
}

export async function getRecentAvis(entrepriseId: string) {
  return db
    .select({
      id: avis.id,
      note: avis.note,
      commentaire: avis.commentaire,
      createdAt: avis.createdAt,
      clientName: users.name,
    })
    .from(avis)
    .leftJoin(users, eq(avis.clientId, users.id))
    .where(eq(avis.entrepriseId, entrepriseId))
    .orderBy(desc(avis.createdAt))
    .limit(5);
}

export async function getMyServices() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const entreprise = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.userId, session.user.id))
    .limit(1);

  if (!entreprise[0]) return [];

  return db
    .select()
    .from(services)
    .where(eq(services.entrepriseId, entreprise[0].id))
    .orderBy(desc(services.createdAt));
}

export async function createService(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };

  const entreprise = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.userId, session.user.id))
    .limit(1);

  if (!entreprise[0]) return { error: "Aucune entreprise trouvée" };

  try {
    const result = await db
      .insert(services)
      .values({
        entrepriseId: entreprise[0].id,
        nom: parsed.data.nom,
        description: parsed.data.description || null,
        prix: parsed.data.prix || null,
        devise: parsed.data.devise,
      })
      .returning();

    revalidatePath("/dashboard/services");
    return { data: result[0] };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur" };
  }
}

export async function toggleServiceActive(serviceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const service = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service[0]) return { error: "Service non trouvé" };

  // Verify ownership
  const entreprise = await db
    .select()
    .from(entreprises)
    .where(
      and(
        eq(entreprises.id, service[0].entrepriseId),
        eq(entreprises.userId, session.user.id)
      )
    )
    .limit(1);

  if (!entreprise[0]) return { error: "Non autorisé" };

  await db
    .update(services)
    .set({ isActive: !service[0].isActive, updatedAt: new Date() })
    .where(eq(services.id, serviceId));

  revalidatePath("/dashboard/services");
  return { data: { success: true } };
}

export async function deleteService(serviceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const service = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service[0]) return { error: "Service non trouvé" };

  const entreprise = await db
    .select()
    .from(entreprises)
    .where(
      and(
        eq(entreprises.id, service[0].entrepriseId),
        eq(entreprises.userId, session.user.id)
      )
    )
    .limit(1);

  if (!entreprise[0]) return { error: "Non autorisé" };

  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/dashboard/services");
  return { data: { success: true } };
}

export async function updateService(serviceId: string, data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };

  const service = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service[0]) return { error: "Service non trouvé" };

  const entreprise = await db
    .select()
    .from(entreprises)
    .where(
      and(
        eq(entreprises.id, service[0].entrepriseId),
        eq(entreprises.userId, session.user.id)
      )
    )
    .limit(1);

  if (!entreprise[0]) return { error: "Non autorisé" };

  try {
    const result = await db
      .update(services)
      .set({
        nom: parsed.data.nom,
        description: parsed.data.description || null,
        prix: parsed.data.prix || null,
        devise: parsed.data.devise,
        updatedAt: new Date(),
      })
      .where(eq(services.id, serviceId))
      .returning();

    revalidatePath("/dashboard/services");
    return { data: result[0] };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur lors de la mise à jour" };
  }
}
