import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SelectRoleView } from "@/modules/auth/ui/views/select-role-view";

export const metadata: Metadata = {
  title: "Choisir mon rôle",
  description: "Sélectionnez votre type de compte BizConnect.",
};

export default async function SelectRolePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // If not logged in, redirect to register
  if (!session?.user) {
    redirect("/register");
  }

  return <SelectRoleView />;
}
