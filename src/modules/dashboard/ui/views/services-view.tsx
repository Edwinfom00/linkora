"use client";

import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/empty-state";
import {
  createService,
  toggleServiceActive,
  deleteService,
} from "@/modules/dashboard/server/actions";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  nom: string;
  description: string | null;
  prix: number | null;
  devise: string;
  isActive: boolean;
}

interface ServicesViewProps {
  initialServices: Service[];
}

export function ServicesView({ initialServices }: ServicesViewProps) {
  const [services, setServices] = useState(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");

  const handleAdd = async () => {
    if (!nom.trim()) {
      toast.error("Le nom du service est requis");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createService({
        nom: nom.trim(),
        description: description.trim() || undefined,
        prix: prix ? parseInt(prix, 10) : undefined,
        devise: "XAF",
      });

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        setServices((prev) => [result.data as Service, ...prev]);
      }
      toast.success("Service ajouté !");
      setNom("");
      setDescription("");
      setPrix("");
      setShowForm(false);
    } catch {
      toast.error("Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    const result = await toggleServiceActive(id);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.success("Service mis à jour");
  };

  const handleDelete = async (id: string) => {
    const result = await deleteService(id);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service supprimé");
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowForm(!showForm)}
        className="rounded-xl bg-indigo hover:bg-indigo/90 text-white gap-2"
      >
        <Plus className="w-4 h-4" />
        Ajouter un service
      </Button>

      {/* Add form */}
      {showForm && (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-nom">Nom du service *</Label>
            <Input
              id="service-nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="h-11 rounded-xl"
              placeholder="Réparation climatiseur"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-desc">Description</Label>
            <Textarea
              id="service-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl resize-none min-h-[60px]"
              placeholder="Détails du service..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-prix">Prix (XAF)</Label>
            <Input
              id="service-prix"
              type="number"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="h-11 rounded-xl"
              placeholder="15000"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="rounded-xl bg-indigo hover:bg-indigo/90 text-white gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Ajouter
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Services list */}
      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={cn(
                "p-5 rounded-2xl bg-card border border-border shadow-sm transition-opacity",
                !service.isActive && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{service.nom}</h4>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  )}
                  {service.prix !== null && (
                    <p className="text-sm font-bold font-mono text-indigo mt-2">
                      {service.prix.toLocaleString("fr-FR")} {service.devise}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(service.id)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      service.isActive
                        ? "text-emerald hover:bg-emerald/10"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    aria-label={
                      service.isActive ? "Désactiver" : "Activer"
                    }
                  >
                    {service.isActive ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon="folder"
            title="Aucun service"
            description="Ajoutez vos premiers services pour les rendre visibles sur votre profil."
          />
        )
      )}
    </div>
  );
}
