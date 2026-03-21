import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { entreprises } from "./entreprises.schema";

export const medias = pgTable("medias", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  entrepriseId: text("entreprise_id")
    .notNull()
    .references(() => entreprises.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: text("type").notNull().default("image"),
  alt: text("alt"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const mediasRelations = relations(medias, ({ one }) => ({
  entreprise: one(entreprises, {
    fields: [medias.entrepriseId],
    references: [entreprises.id],
  }),
}));
