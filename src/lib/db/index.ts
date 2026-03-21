import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as authSchema from "./schema/auth.schema";
import * as categoriesSchema from "./schema/categories.schema";
import * as entreprisesSchema from "./schema/entreprises.schema";
import * as servicesSchema from "./schema/services.schema";
import * as conversationsSchema from "./schema/conversations.schema";
import * as messagesSchema from "./schema/messages.schema";
import * as avisSchema from "./schema/avis.schema";
import * as mediasSchema from "./schema/medias.schema";

// Required in Node.js environments for the Neon serverless driver
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle({ client: pool, schema: {
  ...authSchema,
  ...categoriesSchema,
  ...entreprisesSchema,
  ...servicesSchema,
  ...conversationsSchema,
  ...messagesSchema,
  ...avisSchema,
  ...mediasSchema,
}});

export type Database = typeof db;
