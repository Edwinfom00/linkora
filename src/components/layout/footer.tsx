import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="BizConnect Cameroun">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-[family-name:var(--font-display)] text-white">
                Biz<span className="text-indigo">Connect</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              La plateforme de référence pour connecter clients et entreprises de
              services au Cameroun.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="text-sm hover:text-white transition-colors">
                  Entreprises
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm hover:text-white transition-colors">
                  S&apos;inscrire
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-indigo flex-shrink-0" />
                Douala, Cameroun
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-indigo flex-shrink-0" />
                +237 6XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-indigo flex-shrink-0" />
                contact@bizconnect.cm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} BizConnect Cameroun. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Confidentialité
            </Link>
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
