"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth.schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserRole(role: "client" | "entreprise") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  try {
    await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    revalidatePath("/");
    return { success: true, role };
  } catch {
    return { error: "Erreur lors de la mise à jour du rôle" };
  }
}
