"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On veut cacher la navbar public et le footer public sur le dashboard et sur les messages
  // car ces sections ont leur propre layout ou exigent l'écran total.
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const isMessagesRoute = pathname?.startsWith("/messages");
  
  const hideChrome = isDashboardRoute || isMessagesRoute;

  if (hideChrome) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
