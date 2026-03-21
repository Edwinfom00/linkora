"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { entrepriseSchema, type EntrepriseInput } from "@/lib/validations";
import { createEntreprise, updateEntreprise } from "@/modules/entreprises/server/actions";

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
    <div className="max-w-2xl space-y-6">
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
          Identité visuelle
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Logo de l'entreprise</span>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center cursor-pointer flex flex-col items-center justify-center">
              <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Cliquez pour ajouter<br/>(PNG, JPG - Max 2MB)</p>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Image de couverture</span>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center cursor-pointer flex flex-col items-center justify-center">
              <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Format paysage recommandé<br/>(1200x400 - Max 5MB)</p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-200 rounded-md p-5 shadow-sm space-y-6"
      >
        <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
          Informations générales
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="nom" className="text-sm font-medium text-gray-700">Nom de l'entreprise *</label>
            <input
              id="nom"
              {...register("nom")}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              placeholder="VOLCANO Sarl"
            />
            {errors.nom && (
              <p className="text-xs text-red-600">{errors.nom.message}</p>
            )}
          </div>

          {categories.length > 0 && (
            <div className="space-y-1.5">
              <label htmlFor="categorieId" className="text-sm font-medium text-gray-700">Catégorie</label>
              <select
                id="categorieId"
                value={watch("categorieId") || ""}
                onChange={(e) => setValue("categorieId", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-700"
              >
                <option value="" disabled>Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 min-h-[100px] resize-y"
              placeholder="Décrivez votre entreprise et vos services..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ville" className="text-sm font-medium text-gray-700">Ville *</label>
              <input
                id="ville"
                {...register("ville")}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                placeholder="Douala"
              />
              {errors.ville && (
                <p className="text-xs text-red-600">{errors.ville.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="quartier" className="text-sm font-medium text-gray-700">Quartier</label>
              <input
                id="quartier"
                {...register("quartier")}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                placeholder="Akwa"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adresse" className="text-sm font-medium text-gray-700">Adresse complète</label>
            <input
              id="adresse"
              {...register("adresse")}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              placeholder="Rue de l'Hôpital, face pharmacie..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="telephone" className="text-sm font-medium text-gray-700">Téléphone</label>
              <input
                id="telephone"
                {...register("telephone")}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email professionnel</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                placeholder="contact@entreprise.cm"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="siteWeb" className="text-sm font-medium text-gray-700">Site web</label>
            <input
              id="siteWeb"
              {...register("siteWeb")}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              placeholder="https://www.entreprise.cm"
            />
            {errors.siteWeb && (
              <p className="text-xs text-red-600">{errors.siteWeb.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? "Enregistrer" : "Créer le profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
