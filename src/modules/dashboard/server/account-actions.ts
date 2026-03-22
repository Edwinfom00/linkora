"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth.schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteMyAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  try {
    // Supprimer l'utilisateur — les cascades SQL suppriment automatiquement :
    // sessions, accounts, entreprises, services, avis, conversations, messages, medias
    await db.delete(users).where(eq(users.id, session.user.id));

    return { success: true };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Erreur lors de la suppression du compte",
    };
  }
}
