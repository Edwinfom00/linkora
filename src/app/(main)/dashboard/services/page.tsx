import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyServices } from "@/modules/dashboard/server/actions";
import { ServicesView } from "@/modules/dashboard/ui/views/services-view";

export const metadata: Metadata = {
  title: "Mes services",
  description: "Gérez les services proposés par votre entreprise.",
};

export default async function ServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const services = await getMyServices();

  return (
    <div className="w-full">
      <ServicesView initialServices={services} />
    </div>
  );
}
