import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { LoginForm } from "@/modules/auth/ui/components/login-form";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à BizConnect Cameroun pour accéder à votre tableau de bord et contacter des entreprises.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden mesh-gradient grain-overlay">
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link href="/" className="flex items-center gap-2" aria-label="Retour à l'accueil">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)]">
              BizConnect
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold font-[family-name:var(--font-display)] leading-tight">
              Connectez-vous à
              <br />
              <span className="bg-gradient-to-r from-cyan to-emerald bg-clip-text text-transparent">
                votre espace
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Retrouvez vos messages, gérez votre entreprise et explorez les
              meilleures opportunités au Cameroun.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="glass rounded-xl px-5 py-3">
                <p className="text-2xl font-bold font-mono">500+</p>
                <p className="text-xs text-white/60">Entreprises</p>
              </div>
              <div className="glass rounded-xl px-5 py-3">
                <p className="text-2xl font-bold font-mono">10K+</p>
                <p className="text-xs text-white/60">Clients</p>
              </div>
              <div className="glass rounded-xl px-5 py-3">
                <p className="text-2xl font-bold font-mono">4.8★</p>
                <p className="text-xs text-white/60">Note moyenne</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} BizConnect Cameroun
          </p>
        </div>

        {/* Decorative particles */}
        <div className="particle w-3 h-3 top-1/4 left-1/4" style={{ animationDelay: "0s" }} />
        <div className="particle w-2 h-2 top-1/3 right-1/3" style={{ animationDelay: "2s" }} />
        <div className="particle w-4 h-4 bottom-1/4 left-1/3" style={{ animationDelay: "4s" }} />
        <div className="particle w-2 h-2 top-2/3 right-1/4" style={{ animationDelay: "1s" }} />
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-dark">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-[family-name:var(--font-display)]">
              Biz<span className="text-indigo">Connect</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground">
              Bon retour ! 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          <LoginForm />

          <p className="text-sm text-center text-muted-foreground mt-8">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo hover:text-indigo/80 transition-colors"
            >
              S&apos;inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
