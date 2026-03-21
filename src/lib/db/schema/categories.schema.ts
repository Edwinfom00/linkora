import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { entreprises } from "./entreprises.schema";

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nom: text("nom").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  couleur: text("couleur"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  entreprises: many(entreprises),
}));
