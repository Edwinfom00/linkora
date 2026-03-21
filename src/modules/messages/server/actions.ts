"use server";

import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema/conversations.schema";
import { messages } from "@/lib/db/schema/messages.schema";
import { entreprises } from "@/lib/db/schema/entreprises.schema";
import { users } from "@/lib/db/schema/auth.schema";
import { eq, and, or, desc, asc, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { messageSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getMyConversations() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const userId = session.user.id;

  // Find user's entreprise if they have one
  const userEntreprise = await db
    .select()
    .from(entreprises)
    .where(eq(entreprises.userId, userId))
    .limit(1);

  const entrepriseId = userEntreprise[0]?.id;

  const whereClause = entrepriseId
    ? or(
        eq(conversations.clientId, userId),
        eq(conversations.entrepriseId, entrepriseId)
      )
    : eq(conversations.clientId, userId);

  const convos = await db
    .select({
      id: conversations.id,
      clientId: conversations.clientId,
      entrepriseId: conversations.entrepriseId,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
      entrepriseNom: entreprises.nom,
      entrepriseLogo: entreprises.logoUrl,
      clientName: users.name,
      clientImage: users.image,
    })
    .from(conversations)
    .leftJoin(entreprises, eq(conversations.entrepriseId, entreprises.id))
    .leftJoin(users, eq(conversations.clientId, users.id))
    .where(whereClause!)
    .orderBy(desc(conversations.lastMessageAt));

  // Get last message and unread count for each conversation
  const enriched = await Promise.all(
    convos.map(async (conv) => {
      const lastMsg = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const unreadCount = await db
        .select({ count: count() })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, conv.id),
            eq(messages.isRead, false),
            sql`${messages.senderId} != ${userId}`
          )
        );

      return {
        ...conv,
        lastMessage: lastMsg[0] || null,
        unreadCount: Number(unreadCount[0]?.count) || 0,
      };
    })
  );

  return enriched;
}

export async function getMessages(conversationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return db
    .select({
      id: messages.id,
      content: messages.content,
      senderId: messages.senderId,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      senderName: users.name,
      senderImage: users.image,
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

export async function sendMessage(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Non authentifié" };

  const parsed = messageSchema.safeParse(data);
  if (!parsed.success) return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };

  let conversationId = parsed.data.conversationId;

  // Create conversation if doesn't exist
  if (!conversationId && parsed.data.entrepriseId) {
    // Check if conversation already exists
    const existing = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.clientId, session.user.id),
          eq(conversations.entrepriseId, parsed.data.entrepriseId)
        )
      )
      .limit(1);

    if (existing[0]) {
      conversationId = existing[0].id;
    } else {
      const newConv = await db
        .insert(conversations)
        .values({
          clientId: session.user.id,
          entrepriseId: parsed.data.entrepriseId,
        })
        .returning();
      conversationId = newConv[0].id;
    }
  }

  if (!conversationId) return { error: "Conversation non trouvée" };

  try {
    const msg = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: session.user.id,
        content: parsed.data.content,
      })
      .returning();

    // Update conversation lastMessageAt
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));

    revalidatePath("/messages");
    return { data: msg[0] };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur lors de l'envoi" };
  }
}

export async function markAsRead(conversationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return;

  await db
    .update(messages)
    .set({ isRead: true })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.isRead, false),
        sql`${messages.senderId} != ${session.user.id}`
      )
    );

  revalidatePath("/messages");
}
