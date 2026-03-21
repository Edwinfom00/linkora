import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["client", "entreprise"]).default("client"),
});

export const entrepriseSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  ville: z.string().min(1, "La ville est requise"),
  quartier: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Format d'email invalide").optional().or(z.literal("")),
  siteWeb: z.string().url("URL invalide").optional().or(z.literal("")),
  categorieId: z.string().optional(),
});

export const serviceSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  prix: z.number().min(0, "Le prix doit être positif").optional(),
  devise: z.string().default("XAF"),
});

export const avisSchema = z.object({
  entrepriseId: z.string().min(1, "L'entreprise est requise"),
  note: z.number().min(1, "La note minimum est 1").max(5, "La note maximum est 5"),
  commentaire: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide"),
  conversationId: z.string().optional(),
  entrepriseId: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  categorieId: z.string().optional(),
  ville: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EntrepriseInput = z.infer<typeof entrepriseSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type AvisInput = z.infer<typeof avisSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
