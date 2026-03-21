import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { RegisterForm } from "@/modules/auth/ui/components/register-form";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Créez votre compte BizConnect Cameroun et rejoignez la communauté des professionnels camerounais.",
};

export default function RegisterPage() {
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
              Rejoignez la
              <br />
              <span className="bg-gradient-to-r from-amber to-emerald bg-clip-text text-transparent">
                communauté
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Que vous soyez client ou entrepreneur, BizConnect vous connecte
              aux meilleures opportunités à Douala et au Cameroun.
            </p>

            {/* Features list */}
            <div className="space-y-3 pt-4">
              {[
                "Trouvez les meilleurs professionnels locaux",
                "Contactez directement les entreprises",
                "Référencez votre entreprise gratuitement",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} BizConnect Cameroun
          </p>
        </div>

        {/* Decorative particles */}
        <div className="particle w-3 h-3 top-1/4 right-1/4" style={{ animationDelay: "0s" }} />
        <div className="particle w-2 h-2 top-2/3 left-1/3" style={{ animationDelay: "3s" }} />
        <div className="particle w-4 h-4 bottom-1/3 right-1/3" style={{ animationDelay: "5s" }} />
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
              Créer un compte 🚀
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Inscrivez-vous et commencez dès maintenant
            </p>
          </div>

          <RegisterForm />

          <p className="text-sm text-center text-muted-foreground mt-8">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo hover:text-indigo/80 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
