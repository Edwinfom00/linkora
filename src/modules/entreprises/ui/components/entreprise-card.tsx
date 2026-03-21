"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntrepriseCardProps {
  entreprise: {
    id: string;
    nom: string;
    slug: string;
    description: string | null;
    ville: string;
    quartier: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    isVerified: boolean;
    categorie: {
      nom: string;
      icon: string | null;
      couleur: string | null;
    } | null;
    noteMoyenne: number;
    totalAvis: number;
  };
  className?: string;
}

export function EntrepriseCard({ entreprise, className }: EntrepriseCardProps) {
  return (
    <Link
      href={`/entreprises/${entreprise.slug}`}
      className={cn(
        "bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-150 flex flex-col group",
        className
      )}
    >
      <div 
        className="h-36 w-full rounded-t-md bg-gray-100 bg-cover bg-center border-b border-gray-200"
        style={{ backgroundImage: entreprise.coverUrl ? `url(${entreprise.coverUrl})` : undefined }}
      />
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex items-center gap-3">
          {entreprise.logoUrl ? (
            <img 
              src={entreprise.logoUrl} 
              alt={entreprise.nom}
              className="w-10 h-10 rounded-md border border-gray-200 object-cover bg-gray-50 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center font-semibold text-gray-500 flex-shrink-0">
              {entreprise.nom.charAt(0)}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {entreprise.nom}
            </h3>
            {entreprise.categorie && (
              <span className="inline-flex mt-0.5 text-[10px] sm:text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded px-2 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {entreprise.categorie.nom}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 truncate mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {entreprise.quartier ? `${entreprise.quartier}, ` : ""}
            {entreprise.ville}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-auto pt-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-800">
            {entreprise.noteMoyenne > 0 ? entreprise.noteMoyenne.toFixed(1) : "—"}
          </span>
          <span className="text-xs text-gray-400">
            ({entreprise.totalAvis} avis)
          </span>
        </div>

        <button className="w-full bg-blue-600 text-white text-sm font-medium rounded-md py-2 mt-2 hover:bg-blue-700 transition-colors duration-150">
          Voir le profil
        </button>
      </div>
    </Link>
  );
}
