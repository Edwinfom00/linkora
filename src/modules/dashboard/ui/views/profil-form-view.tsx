"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { entrepriseSchema, type EntrepriseInput } from "@/lib/validations";
import { createEntreprise, updateEntreprise } from "@/modules/entreprises/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfilFormViewProps {
  entreprise: {
    id: string;
    nom: string;
    description: string | null;
    ville: string;
    quartier: string | null;
    adresse: string | null;
    telephone: string | null;
    email: string | null;
    siteWeb: string | null;
    categorieId: string | null;
  } | null;
  categories: {
    id: string;
    nom: string;
    slug: string;
  }[];
}

export function ProfilFormView({ entreprise, categories }: ProfilFormViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!entreprise;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntrepriseInput>({
    resolver: zodResolver(entrepriseSchema),
    defaultValues: {
      nom: entreprise?.nom || "",
      description: entreprise?.description || "",
      ville: entreprise?.ville || "Douala",
      quartier: entreprise?.quartier || "",
      adresse: entreprise?.adresse || "",
      telephone: entreprise?.telephone || "",
      email: entreprise?.email || "",
      siteWeb: entreprise?.siteWeb || "",
      categorieId: entreprise?.categorieId || "",
    },
  });

  const onSubmit = async (data: EntrepriseInput) => {
    setIsLoading(true);
    try {
      const result = isEditing
        ? await updateEntreprise(entreprise.id, data)
        : await createEntreprise(data);

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isEditing ? "Profil mis à jour !" : "Entreprise créée avec succès !"
      );
      router.refresh();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-6 rounded-2xl bg-card border border-border shadow-sm"
    >
      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de l&apos;entreprise *</Label>
        <Input
          id="nom"
          {...register("nom")}
          className="h-12 rounded-xl"
          placeholder="VOLCANO Sarl"
        />
        {errors.nom && (
          <p className="text-xs text-red-500">{errors.nom.message}</p>
        )}
      </div>

      {/* Catégorie */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select
            value={watch("categorieId") || ""}
            onValueChange={(v) => setValue("categorieId", v)}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          className="rounded-xl min-h-[100px] resize-none"
          placeholder="Décrivez votre entreprise et vos services..."
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ville">Ville *</Label>
          <Input
            id="ville"
            {...register("ville")}
            className="h-12 rounded-xl"
            placeholder="Douala"
          />
          {errors.ville && (
            <p className="text-xs text-red-500">{errors.ville.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quartier">Quartier</Label>
          <Input
            id="quartier"
            {...register("quartier")}
            className="h-12 rounded-xl"
            placeholder="Akwa"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse complète</Label>
        <Input
          id="adresse"
          {...register("adresse")}
          className="h-12 rounded-xl"
          placeholder="Rue de l'Hôpital, face pharmacie..."
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            {...register("telephone")}
            className="h-12 rounded-xl"
            placeholder="+237 6XX XXX XXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="h-12 rounded-xl"
            placeholder="contact@entreprise.cm"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteWeb">Site web</Label>
        <Input
          id="siteWeb"
          {...register("siteWeb")}
          className="h-12 rounded-xl"
          placeholder="https://www.entreprise.cm"
        />
        {errors.siteWeb && (
          <p className="text-xs text-red-500">{errors.siteWeb.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-indigo hover:bg-indigo/90 text-white font-semibold shadow-lg shadow-indigo/25 gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {isEditing ? "Enregistrer les modifications" : "Créer mon entreprise"}
      </Button>
    </form>
  );
}
