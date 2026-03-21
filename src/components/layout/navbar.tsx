"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BC";

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-white border-b border-gray-200">
      <nav className="h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between" aria-label="Navigation principale">
        
        {/* Left side: Logo + Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="BizConnect Cameroun — Accueil"
          >
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center transition-colors hover:bg-blue-700">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:inline-block text-base font-bold text-gray-900 tracking-tight">
              BizConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/entreprises"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
            >
              Entreprises
            </Link>
            {user && (
              <Link
                href="/messages"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </Link>
            )}
          </div>
        </div>

        {/* Right side: Auth / User actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isPending ? (
            <div className="w-8 h-8 rounded-md bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center font-medium text-gray-700 text-xs shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-md border border-gray-200 shadow-md py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1 border-b border-gray-100">
                      {(user as { role?: string }).role === "entreprise" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                      {(user as { role?: string }).role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Administration
                        </Link>
                      )}
                      <Link
                        href="/messages"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-gray-50 text-gray-600 transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

      </nav>

      {/* Mobile Navigation Dropdown */}
      <div
        className={cn(
          "md:hidden absolute top-14 left-0 w-full bg-white border-b border-gray-200 overflow-hidden transition-all duration-200 ease-in-out shadow-sm",
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <div className="px-4 py-2 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/entreprises"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Entreprises
          </Link>
          {user && (
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Messages
            </Link>
          )}
          {!user && (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block sm:hidden px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
