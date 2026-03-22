"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Star,
  User,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/profil", icon: User, label: "Profil" },
  { href: "/dashboard/services", icon: Wrench, label: "Services" },
  { href: "/dashboard/avis", icon: Star, label: "Avis" },
  { href: "/dashboard/parametres", icon: Settings, label: "Paramètres" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex bg-background min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static h-screen shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border lg:hidden">
            <span className="text-sm font-semibold text-foreground">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Fermer le menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Branding */}
          <div className="hidden lg:flex h-14 items-center px-4 border-b border-border shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: "#6366F1" }}>
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-foreground tracking-tight text-sm">BizConnect</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "font-medium shadow-sm border border-border bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
                style={isActive ? { color: "#6366F1" } : {}}
              >
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-colors border border-transparent"
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 lg:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-foreground">Tableau de bord</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 bg-muted/30 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
