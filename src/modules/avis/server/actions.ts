"use server";

import { db } from "@/lib/db";
import { avis } from "@/lib/db/schema/avis.schema";
import { users } from "@/lib/db/schema/auth.schema";
import { eq, and, desc, avg, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { avisSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createAvis(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const parsed = avisSchema.safeParse(data);
  if (!parsed.success) return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };

  // Check if user already reviewed this entreprise
  const existing = await db
    .select()
    .from(avis)
    .where(
      and(
        eq(avis.entrepriseId, parsed.data.entrepriseId),
        eq(avis.clientId, session.user.id)
      )
    )
    .limit(1);

  if (existing[0]) {
    return { error: "Vous avez déjà laissé un avis pour cette entreprise" };
  }

  try {
    const result = await db
      .insert(avis)
      .values({
        entrepriseId: parsed.data.entrepriseId,
        clientId: session.user.id,
        note: parsed.data.note,
        commentaire: parsed.data.commentaire || null,
      })
      .returning();

    revalidatePath("/entreprises");
    return { data: result[0] };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur lors de l'envoi" };
  }
}

export async function getAvisByEntreprise(entrepriseId: string) {
  return db
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
    .where(eq(avis.entrepriseId, entrepriseId))
    .orderBy(desc(avis.createdAt));
}

export async function getAvisStats(entrepriseId: string) {
  const stats = await db
    .select({
      moyenne: avg(avis.note),
      total: count(avis.id),
    })
    .from(avis)
    .where(eq(avis.entrepriseId, entrepriseId));

  const distribution = await db
    .select({
      note: avis.note,
      count: count(),
    })
    .from(avis)
    .where(eq(avis.entrepriseId, entrepriseId))
    .groupBy(avis.note);

  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  distribution.forEach((d) => {
    dist[d.note] = Number(d.count);
  });

  return {
    moyenne: Number(stats[0]?.moyenne) || 0,
    total: Number(stats[0]?.total) || 0,
    distribution: dist as Record<1 | 2 | 3 | 4 | 5, number>,
  };
}
