import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="BizConnect Cameroun">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 tracking-tight">
                BizConnect
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              La plateforme de référence pour connecter clients et entreprises au Cameroun.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Produit
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Entreprises
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Ressources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Douala, Cameroun<br />Akwa, Rue Carnot</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                +237 6XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                contact@bizconnect.cm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} BizConnect Cameroun. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
              Confidentialité
            </Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
