"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  BadgeCheck,
  MessageSquare,
  Clock,
  Star,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AvisSection } from "@/modules/avis/ui/components/avis-section";

interface EntrepriseProfileViewProps {
  entreprise: {
    id: string;
    nom: string;
    slug: string;
    description: string | null;
    ville: string;
    quartier: string | null;
    adresse: string | null;
    telephone: string | null;
    email: string | null;
    siteWeb: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    isVerified: boolean;
    createdAt: Date;
    categorie: {
      id: string;
      nom: string;
      slug: string;
      icon: string | null;
      couleur: string | null;
    } | null;
    services: {
      id: string;
      nom: string;
      description: string | null;
      prix: number | null;
      devise: string;
    }[];
    avis: {
      id: string;
      note: number;
      commentaire: string | null;
      createdAt: Date;
      clientName: string | null;
      clientImage: string | null;
    }[];
    stats: {
      noteMoyenne: number;
      totalAvis: number;
      distribution: Record<1 | 2 | 3 | 4 | 5, number>;
    };
  };
}

export function EntrepriseProfileView({
  entreprise,
}: EntrepriseProfileViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Sticky (Optional here if not handled at layout level, but keeping design clean) */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 py-3 px-4 shadow-sm" style={{ top: '56px' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-gray-500 font-medium whitespace-nowrap overflow-x-auto">
          <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
          <span className="text-gray-400">/</span>
          <Link href="/entreprises" className="hover:text-gray-900 transition-colors">Entreprises</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 truncate">{entreprise.nom}</span>
        </div>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne gauche (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HeroSection */}
          <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <div 
              className="h-48 md:h-56 w-full rounded-md bg-gray-200 border border-gray-200 bg-cover bg-center"
              style={{ backgroundImage: entreprise.coverUrl ? `url(${entreprise.coverUrl})` : undefined }}
            />
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4">
              {entreprise.logoUrl ? (
                <img 
                  src={entreprise.logoUrl} 
                  alt={entreprise.nom}
                  className="w-16 h-16 rounded-md border-2 border-white shadow-md bg-white object-cover -mt-10 sm:-mt-8 flex-shrink-0 z-10"
                />
              ) : (
                <div className="w-16 h-16 rounded-md border-2 border-white shadow-md bg-gray-50 flex items-center justify-center font-bold text-gray-400 text-xl -mt-10 sm:-mt-8 flex-shrink-0 z-10">
                  {entreprise.nom.charAt(0)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">{entreprise.nom}</h1>
                  {entreprise.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Vérifié
                    </span>
                  )}
                  {entreprise.categorie && (
                    <span className="inline-flex text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded px-2 py-0.5">
                      {entreprise.categorie.nom}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {entreprise.quartier ? `${entreprise.quartier}, ` : ""}{entreprise.ville}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-gray-700">{entreprise.stats.noteMoyenne > 0 ? entreprise.stats.noteMoyenne.toFixed(1) : "—"}</span>
                    <span className="text-gray-400">({entreprise.stats.totalAvis} avis)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Inscrit en {new Date(entreprise.createdAt).getFullYear()}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {entreprise.description && (
            <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                À propos
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {entreprise.description}
              </p>
            </div>
          )}

          {/* Services */}
          {entreprise.services.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Services proposés
              </h2>
              <div className="divide-y divide-gray-100">
                {entreprise.services.map((service) => (
                  <div key={service.id} className="flex justify-between items-start py-3 first:pt-0 last:pb-0">
                    <div className="flex-1 pr-4">
                      <h3 className="text-sm font-medium text-gray-900">{service.nom}</h3>
                      {service.description && (
                        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                      )}
                    </div>
                    {service.prix !== null && (
                      <div className="text-right flex-shrink-0">
                        <span className="block text-sm font-semibold text-gray-900">
                          {service.prix.toLocaleString("fr-FR")} <span className="text-xs text-gray-400 font-normal">{service.devise}</span>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avis Section Wrapper */}
          <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Avis clients
            </h2>
            <AvisSection
              entrepriseId={entreprise.id}
              entrepriseSlug={entreprise.slug}
              avis={entreprise.avis}
              stats={entreprise.stats}
            />
          </div>

        </div>

        {/* Colonne droite (lg:col-span-1) */}
        <div className="lg:col-span-1 relative">
          {/* Contact Card (Sticky) */}
          <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm sticky top-28">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Coordonnées
            </h2>

            <div className="space-y-4 mb-6">
              {entreprise.telephone && (
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Phone className="w-4 h-4 mt-0.5 text-gray-400" />
                  <a href={`tel:${entreprise.telephone}`} className="hover:text-blue-600 transition-colors">
                    {entreprise.telephone}
                  </a>
                </div>
              )}
              {entreprise.email && (
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Mail className="w-4 h-4 mt-0.5 text-gray-400" />
                  <a href={`mailto:${entreprise.email}`} className="hover:text-blue-600 transition-colors break-all">
                    {entreprise.email}
                  </a>
                </div>
              )}
              {entreprise.siteWeb && (
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <Globe className="w-4 h-4 mt-0.5 text-gray-400" />
                  <a href={entreprise.siteWeb} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors break-all">
                    {entreprise.siteWeb}
                  </a>
                </div>
              )}
              {entreprise.adresse && (
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                  <span>{entreprise.adresse}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Link 
                href={`/messages?entreprise=${entreprise.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
                aria-label="Envoyer un message"
              >
                <MessageSquare className="w-4 h-4" />
                Envoyer un message
              </Link>
              
              {entreprise.telephone && (
                <a 
                  href={`tel:${entreprise.telephone}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Appeler
                </a>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
