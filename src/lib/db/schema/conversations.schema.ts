import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { entreprises } from "./entreprises.schema";
import { messages } from "./messages.schema";

export const conversations = pgTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entrepriseId: text("entreprise_id")
    .notNull()
    .references(() => entreprises.id, { onDelete: "cascade" }),
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    client: one(users, {
      fields: [conversations.clientId],
      references: [users.id],
    }),
    entreprise: one(entreprises, {
      fields: [conversations.entrepriseId],
      references: [entreprises.id],
    }),
    messages: many(messages),
  })
);
