"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { loginSchema, registerSchema } from "@/lib/validations";
import type { AuthActionResult } from "../types/type.d";

export async function getSessionAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function registerAction(
  data: unknown
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: parsed.data.role,
      },
    });

    return {
      data: {
        redirectTo:
          parsed.data.role === "entreprise" ? "/dashboard" : "/",
      },
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de l'inscription";
    return { error: message };
  }
}

export async function loginAction(
  data: unknown
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: (parsed.error as any).errors[0]?.message || "Données invalides" };
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });

    const userRole = (result.user as { role?: string }).role || "client";
    const redirectTo =
      userRole === "admin"
        ? "/admin"
        : userRole === "entreprise"
          ? "/dashboard"
          : "/";

    return { data: { redirectTo } };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Email ou mot de passe incorrect";
    return { error: message };
  }
}

export async function logoutAction(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  });
}
