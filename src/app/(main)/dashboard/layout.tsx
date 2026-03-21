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
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/profil", icon: User, label: "Profil" },
  { href: "/dashboard/services", icon: Wrench, label: "Services" },
  { href: "/dashboard/avis", icon: Star, label: "Avis" },
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
    <div className="flex bg-white min-h-screen">
      {/* Sidebar Desktop & Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static h-screen shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 lg:hidden">
            <span className="text-sm font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500"
              aria-label="Fermer le menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Branding */}
          <div className="hidden lg:flex h-14 items-center px-4 border-b border-gray-200 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 tracking-tight text-sm">BizConnect</span>
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
                    ? "text-blue-700 bg-white border border-gray-200 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 w-full transition-colors border border-transparent"
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
          <span className="text-sm font-semibold text-gray-900">Tableau de bord</span>
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
