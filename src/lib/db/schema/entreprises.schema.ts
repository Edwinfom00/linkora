import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { categories } from "./categories.schema";
import { services } from "./services.schema";
import { avis } from "./avis.schema";
import { medias } from "./medias.schema";
import { conversations } from "./conversations.schema";

export const entreprises = pgTable("entreprises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categorieId: text("categorie_id").references(() => categories.id),
  nom: text("nom").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  ville: text("ville").notNull().default("Douala"),
  quartier: text("quartier"),
  adresse: text("adresse"),
  telephone: text("telephone"),
  email: text("email"),
  siteWeb: text("site_web"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const entreprisesRelations = relations(entreprises, ({ one, many }) => ({
  user: one(users, {
    fields: [entreprises.userId],
    references: [users.id],
  }),
  categorie: one(categories, {
    fields: [entreprises.categorieId],
    references: [categories.id],
  }),
  services: many(services),
  avis: many(avis),
  medias: many(medias),
  conversations: many(conversations),
}));
