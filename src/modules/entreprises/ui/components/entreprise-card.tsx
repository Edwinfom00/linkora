"use client";

import Link from "next/link";
import { MapPin, BadgeCheck, ArrowRight, Star } from "lucide-react";
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
  const coverBg = entreprise.coverUrl
    ? `url(${entreprise.coverUrl})`
    : "linear-gradient(135deg, #1E1E2E 0%, #0F0F1A 100%)"; // Darker default gradient to match editorial style

  return (
    <Link
      href={`/entreprises/${entreprise.slug}`}
      className={cn(
        "group relative flex flex-col h-[340px] rounded-xl overflow-hidden bg-card border border-border/60 hover:border-border shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
      aria-label={`Voir le profil de ${entreprise.nom}`}
    >
      {/* Top half — Cover Image */}
      <div className="relative h-32 shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: coverBg }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category badge */}
        {entreprise.categorie && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: entreprise.categorie.couleur || "#6366F1" }}
            />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/90">
              {entreprise.categorie.nom}
            </span>
          </div>
        )}

        {/* Verification Badge */}
        {entreprise.isVerified && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-emerald/10 backdrop-blur-md border border-emerald/20 px-2 py-1 rounded flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-emerald" />
              <span className="text-[10px] uppercase font-bold text-emerald">Vérifié</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom half — Content */}
      <div className="relative flex-1 p-5 flex flex-col bg-card">
        {/* Floating Logo intersecting the cover */}
        <div className="absolute -top-10 left-5">
          <div className="w-16 h-16 rounded-xl bg-card shadow-sm border border-border flex items-center justify-center overflow-hidden">
            {entreprise.logoUrl ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${entreprise.logoUrl})` }}
                role="img"
                aria-label={`Logo de ${entreprise.nom}`}
              />
            ) : (
              <span className="text-xl font-bold font-[family-name:var(--font-display)] text-indigo">
                {entreprise.nom.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Spacer to push content down below the floating logo */}
        <div className="h-6 shrink-0" />

        {/* Title & Info */}
        <div className="mt-2 min-w-0 flex-1">
          <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground truncate group-hover:text-indigo transition-colors duration-200">
            {entreprise.nom}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {entreprise.quartier ? `${entreprise.quartier}, ` : ""}
              {entreprise.ville}
            </span>
          </div>

          {entreprise.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
              {entreprise.description}
            </p>
          )}
        </div>

        {/* Footer (Rating & CTA) */}
        <div className="mt-4 pt-4 flex items-center justify-between border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber text-amber" />
            <span className="font-semibold text-sm">
              {entreprise.noteMoyenne > 0 ? entreprise.noteMoyenne.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({entreprise.totalAvis} avis)
            </span>
          </div>

          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-indigo group-hover:bg-indigo group-hover:text-white transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
