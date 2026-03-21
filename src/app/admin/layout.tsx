"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  Shield,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/utilisateurs", icon: Users, label: "Utilisateurs" },
  { href: "/admin/entreprises", icon: Building2, label: "Entreprises" },
];

export default function AdminLayout({
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
    <div className="flex bg-gray-50 min-h-[calc(100vh-56px)]">
      {/* Sidebar Desktop & Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static h-[calc(100vh-56px)] shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800 lg:hidden text-white">
          <span className="text-sm font-semibold">Menu Admin</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-800 transition-colors text-gray-400"
            aria-label="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-gray-800 hidden lg:flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-semibold text-white">Admin Panel</span>
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
                    ? "bg-gray-800 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-800 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 w-full transition-colors border border-transparent"
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
        <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-3 lg:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-900">Administration</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 bg-gray-50 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
