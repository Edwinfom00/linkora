"use client";

import { useState } from "react";
import { BadgeCheck, Ban, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  toggleEntrepriseVerified,
  toggleEntrepriseActive,
} from "@/modules/admin/server/actions";

interface Entreprise {
  id: string;
  nom: string;
  slug: string;
  ville: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

interface AdminEntreprisesViewProps {
  initialEntreprises: Entreprise[];
}

export function AdminEntreprisesView({ initialEntreprises }: AdminEntreprisesViewProps) {
  const [entreprises, setEntreprises] = useState(initialEntreprises);

  const handleVerify = async (id: string) => {
    const result = await toggleEntrepriseVerified(id);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    setEntreprises((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, isVerified: !e.isVerified } : e
      )
    );
    toast.success("Statut mis à jour");
  };

  const handleToggleActive = async (id: string) => {
    const result = await toggleEntrepriseActive(id);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    setEntreprises((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, isActive: !e.isActive } : e
      )
    );
    toast.success("Statut mis à jour");
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Vérifiée</TableHead>
            <TableHead>Créée le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entreprises.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.nom}</TableCell>
              <TableCell className="text-muted-foreground">{e.ville}</TableCell>
              <TableCell>
                <Badge
                  variant={e.isActive ? "default" : "destructive"}
                  className="rounded-lg"
                >
                  {e.isActive ? "Active" : "Suspendue"}
                </Badge>
              </TableCell>
              <TableCell>
                {e.isVerified ? (
                  <Badge className="rounded-lg bg-emerald/10 text-emerald border-0 gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Vérifiée
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded-lg gap-1">
                    En attente
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(e.createdAt).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVerify(e.id)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    aria-label={e.isVerified ? "Révoquer" : "Vérifier"}
                    title={e.isVerified ? "Révoquer la vérification" : "Vérifier"}
                  >
                    {e.isVerified ? (
                      <XCircle className="w-4 h-4 text-amber" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleActive(e.id)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    aria-label={e.isActive ? "Suspendre" : "Activer"}
                    title={e.isActive ? "Suspendre" : "Réactiver"}
                  >
                    <Ban
                      className={`w-4 h-4 ${
                        e.isActive ? "text-red-500" : "text-emerald"
                      }`}
                    />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
