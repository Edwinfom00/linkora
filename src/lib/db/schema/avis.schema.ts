import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { entreprises } from "./entreprises.schema";

export const avis = pgTable("avis", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  entrepriseId: text("entreprise_id")
    .notNull()
    .references(() => entreprises.id, { onDelete: "cascade" }),
  clientId: text("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  note: integer("note").notNull(),
  commentaire: text("commentaire"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const avisRelations = relations(avis, ({ one }) => ({
  entreprise: one(entreprises, {
    fields: [avis.entrepriseId],
    references: [entreprises.id],
  }),
  client: one(users, {
    fields: [avis.clientId],
    references: [users.id],
  }),
}));
