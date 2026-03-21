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
              Connectez-vous à
              <br />
              <span className="text-blue-400">
                votre espace
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Retrouvez vos messages, gérez votre entreprise et explorez les
              meilleures opportunités au Cameroun.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-md px-5 py-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold tracking-tight">500+</p>
                <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Entreprises</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-md px-5 py-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold tracking-tight">10K+</p>
                <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Clients</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-md px-5 py-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold tracking-tight">4.8★</p>
                <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Note moyenne</p>
              </div>
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
              Bon retour !
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          <LoginForm />

          <p className="text-sm text-center text-gray-500 mt-8">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
