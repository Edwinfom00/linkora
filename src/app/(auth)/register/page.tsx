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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link href="/" className="flex items-center gap-2 w-max" aria-label="Retour à l'accueil">
            <div className="w-10 h-10 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              BizConnect
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
              Rejoignez la
              <br />
              <span className="text-amber-400">
                communauté
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Que vous soyez client ou entrepreneur, BizConnect vous connecte
              aux meilleures opportunités à Douala et au Cameroun.
            </p>

            {/* Features list */}
            <div className="space-y-4 pt-4">
              {[
                "Trouvez les meilleurs professionnels locaux",
                "Contactez directement les entreprises",
                "Référencez votre entreprise gratuitement",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} BizConnect Cameroun
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              BizConnect
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Créer un compte
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">
              Inscrivez-vous et commencez dès maintenant
            </p>
          </div>

          <RegisterForm />

          <p className="text-sm text-center text-gray-500 mt-8">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
