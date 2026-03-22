import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SettingsView } from "@/modules/dashboard/ui/views/settings-view";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Gérez les paramètres de votre compte.",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  return <SettingsView userName={session.user.name} />;
}
