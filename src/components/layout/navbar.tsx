"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-dark/80 border-b border-slate-100 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="BizConnect Cameroun — Accueil"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center shadow-lg shadow-indigo/25 group-hover:shadow-indigo/40 transition-shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground">
                Biz<span className="text-indigo">Connect</span>
              </span>
              <span className="block text-[10px] -mt-1 text-muted-foreground tracking-wider uppercase">
                Cameroun
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/entreprises"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Entreprises
            </Link>
            {user && (
              <Link
                href="/messages"
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 inline mr-1.5" />
                Messages
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
                    aria-label="Menu utilisateur"
                  >
                    <Avatar className="w-8 h-8 border-2 border-indigo/20">
                      <AvatarFallback className="bg-gradient-to-br from-indigo to-cyan text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {(user as { role?: string }).role === "entreprise" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="gap-2 rounded-lg cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(user as { role?: string }).role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="gap-2 rounded-lg cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/messages" className="gap-2 rounded-lg cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="hidden sm:inline-flex rounded-xl border-slate-200 dark:border-white/10 text-sm"
                >
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-xl bg-indigo hover:bg-indigo/90 text-white text-sm shadow-lg shadow-indigo/25"
                >
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-white/10">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/entreprises"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Entreprises
            </Link>
            {user && (
              <Link
                href="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Messages
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-indigo hover:text-indigo/80 rounded-lg hover:bg-indigo/5 transition-colors sm:hidden"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
