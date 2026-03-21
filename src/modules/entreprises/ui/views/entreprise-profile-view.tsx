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
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
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
  const coverBg = entreprise.coverUrl
    ? `url(${entreprise.coverUrl})`
    : "linear-gradient(135deg, #312e81, #164e63, #065f46)";

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo Hero */}
      <div className="relative h-[280px] md:h-[360px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: coverBg }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Stats overlay */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {[
            { label: "Avis", value: entreprise.stats.totalAvis },
            {
              label: "Note",
              value:
                entreprise.stats.noteMoyenne > 0
                  ? entreprise.stats.noteMoyenne.toFixed(1) + "★"
                  : "N/A",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="glass rounded-xl px-3 py-2 text-center text-white"
            >
              <p className="text-sm font-bold font-mono">{s.value}</p>
              <p className="text-[10px] text-white/60 uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Logo floating */}
        <div className="absolute bottom-[-40px] left-6 z-20">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-xl ring-4 ring-white flex items-center justify-center overflow-hidden">
            {entreprise.logoUrl ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${entreprise.logoUrl})` }}
                role="img"
                aria-label={`Logo de ${entreprise.nom}`}
              />
            ) : (
              <span className="text-3xl font-bold font-[family-name:var(--font-display)] text-indigo">
                {entreprise.nom.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-foreground">
                  {entreprise.nom}
                </h1>
                {entreprise.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan bg-cyan/10 px-2.5 py-1 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Vérifié
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {entreprise.quartier
                    ? `${entreprise.quartier}, `
                    : ""}
                  {entreprise.ville}
                </span>
                {entreprise.categorie && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${entreprise.categorie.couleur || "#6366F1"}15`,
                      color: entreprise.categorie.couleur || "#6366F1",
                    }}
                  >
                    {entreprise.categorie.nom}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Membre depuis{" "}
                  {new Date(entreprise.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <StarRating
                  rating={entreprise.stats.noteMoyenne}
                  showValue
                />
                <span className="text-sm text-muted-foreground">
                  ({entreprise.stats.totalAvis} avis)
                </span>
              </div>
            </div>

            {/* Description */}
            {entreprise.description && (
              <div>
                <h2 className="text-lg font-semibold font-[family-name:var(--font-display)] text-foreground mb-3">
                  À propos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {entreprise.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Services */}
            {entreprise.services.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold font-[family-name:var(--font-display)] text-foreground mb-4">
                  Services proposés
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entreprise.services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 rounded-2xl bg-card border border-border hover:border-indigo/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-foreground">
                            {service.nom}
                          </h3>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        {service.prix !== null && (
                          <span className="text-sm font-bold font-mono text-indigo whitespace-nowrap">
                            {service.prix.toLocaleString("fr-FR")} {service.devise}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Avis */}
            <AvisSection
              entrepriseId={entreprise.id}
              entrepriseSlug={entreprise.slug}
              avis={entreprise.avis}
              stats={entreprise.stats}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm sticky top-24">
              <h3 className="text-base font-semibold font-[family-name:var(--font-display)] text-foreground mb-4">
                Contacter
              </h3>

              <div className="space-y-3 mb-6">
                {entreprise.telephone && (
                  <a
                    href={`tel:${entreprise.telephone}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-indigo" />
                    </div>
                    {entreprise.telephone}
                  </a>
                )}
                {entreprise.email && (
                  <a
                    href={`mailto:${entreprise.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-cyan/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-cyan" />
                    </div>
                    <span className="truncate">{entreprise.email}</span>
                  </a>
                )}
                {entreprise.siteWeb && (
                  <a
                    href={entreprise.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-emerald" />
                    </div>
                    <span className="truncate">{entreprise.siteWeb}</span>
                  </a>
                )}
                {entreprise.adresse && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-9 h-9 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-amber" />
                    </div>
                    {entreprise.adresse}
                  </div>
                )}
              </div>

              <Button
                asChild
                className="w-full h-12 rounded-xl bg-indigo hover:bg-indigo/90 text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 transition-all gap-2"
              >
                <Link href={`/messages?entreprise=${entreprise.id}`}>
                  <MessageSquare className="w-4 h-4" />
                  Envoyer un message
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
