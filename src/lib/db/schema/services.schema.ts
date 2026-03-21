import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { entreprises } from "./entreprises.schema";

export const services = pgTable("services", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  entrepriseId: text("entreprise_id")
    .notNull()
    .references(() => entreprises.id, { onDelete: "cascade" }),
  nom: text("nom").notNull(),
  description: text("description"),
  prix: integer("prix"),
  devise: text("devise").notNull().default("XAF"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const servicesRelations = relations(services, ({ one }) => ({
  entreprise: one(entreprises, {
    fields: [services.entrepriseId],
    references: [entreprises.id],
  }),
}));
