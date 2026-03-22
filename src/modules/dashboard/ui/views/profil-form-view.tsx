"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, UploadCloud, X, ImageIcon, CheckCircle } from "lucide-react";
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
    logoUrl: string | null;
    coverUrl: string | null;
  } | null;
  categories: {
    id: string;
    nom: string;
    slug: string;
  }[];
}

async function uploadFile(file: File, type: "logo" | "cover"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erreur lors de l'upload");
  }

  const data = await res.json();
  return data.url;
}

export function ProfilFormView({ entreprise, categories }: ProfilFormViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const isEditing = !!entreprise;

  // Image state
  const [logoPreview, setLogoPreview] = useState<string | null>(entreprise?.logoUrl || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(entreprise?.coverUrl || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = useCallback(
    (type: "logo" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const maxSize = type === "cover" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`Fichier trop volumineux. Max ${type === "cover" ? "5" : "2"} MB.`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format non supporté. Utilisez JPG, PNG, WebP ou GIF.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === "logo") {
          setLogoPreview(ev.target?.result as string);
          setLogoFile(file);
        } else {
          setCoverPreview(ev.target?.result as string);
          setCoverFile(file);
        }
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const clearImage = useCallback((type: "logo" | "cover") => {
    if (type === "logo") {
      setLogoPreview(null);
      setLogoFile(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    } else {
      setCoverPreview(null);
      setCoverFile(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }, []);

  const onSubmit = async (data: EntrepriseInput) => {
    setIsLoading(true);

    try {
      let newLogoUrl: string | undefined;
      let newCoverUrl: string | undefined;

      // Upload logo if new file selected
      if (logoFile) {
        setLoadingStep("Upload du logo en cours...");
        try {
          newLogoUrl = await uploadFile(logoFile, "logo");
        } catch (err: any) {
          toast.error(err.message || "Erreur upload logo");
          setIsLoading(false);
          setLoadingStep("");
          return;
        }
      }

      // Upload cover if new file selected
      if (coverFile) {
        setLoadingStep("Upload de la couverture en cours...");
        try {
          newCoverUrl = await uploadFile(coverFile, "cover");
        } catch (err: any) {
          toast.error(err.message || "Erreur upload couverture");
          setIsLoading(false);
          setLoadingStep("");
          return;
        }
      }

      setLoadingStep("Sauvegarde du profil...");

      // Build images object only if we have changes
      const images: { logoUrl?: string; coverUrl?: string } = {};
      if (newLogoUrl) images.logoUrl = newLogoUrl;
      else if (logoPreview === null && entreprise?.logoUrl) images.logoUrl = "";
      if (newCoverUrl) images.coverUrl = newCoverUrl;
      else if (coverPreview === null && entreprise?.coverUrl) images.coverUrl = "";

      const hasImageChanges = Object.keys(images).length > 0;

      const result = isEditing
        ? await updateEntreprise(entreprise.id, data, hasImageChanges ? images : undefined)
        : await createEntreprise(data, hasImageChanges ? images : undefined);

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isEditing ? "Profil mis à jour !" : "Entreprise créée avec succès !"
      );
      setLogoFile(null);
      setCoverFile(null);
      router.refresh();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Visual identity section — INSIDE the form */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border">
          Identité visuelle
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Logo upload */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Logo de l&apos;entreprise</span>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect("logo")}
            />
            {logoPreview ? (
              <div className="relative group">
                <div className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Pending badge */}
                {logoFile && (
                  <div className="absolute top-2 left-2 z-10 bg-amber/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Non sauvegardé
                  </div>
                )}
                {!logoFile && entreprise?.logoUrl && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> En ligne
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={() => clearImage("logo")}
                    className="p-1.5 text-white bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full aspect-square border-2 border-dashed border-border rounded-xl hover:border-indigo/40 hover:bg-indigo/5 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  Cliquez pour ajouter<br />(PNG, JPG — Max 2MB)
                </p>
              </button>
            )}
          </div>

          {/* Cover upload */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Image de couverture</span>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect("cover")}
            />
            {coverPreview ? (
              <div className="relative group">
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Pending badge */}
                {coverFile && (
                  <div className="absolute top-2 left-2 z-10 bg-amber/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Non sauvegardé
                  </div>
                )}
                {!coverFile && entreprise?.coverUrl && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> En ligne
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={() => clearImage("cover")}
                    className="p-1.5 text-white bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-video border-2 border-dashed border-border rounded-xl hover:border-indigo/40 hover:bg-indigo/5 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  Format paysage recommandé<br />(1200×400 — Max 5MB)
                </p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 pb-3 border-b border-border">
          Informations générales
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="nom" className="text-sm font-medium text-muted-foreground">Nom de l&apos;entreprise *</label>
            <input
              id="nom"
              {...register("nom")}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
              placeholder="VOLCANO Sarl"
            />
            {errors.nom && (
              <p className="text-xs text-destructive">{errors.nom.message}</p>
            )}
          </div>

          {categories.length > 0 && (
            <div className="space-y-1.5">
              <label htmlFor="categorieId" className="text-sm font-medium text-muted-foreground">Catégorie</label>
              <select
                id="categorieId"
                value={watch("categorieId") || ""}
                onChange={(e) => setValue("categorieId", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors text-foreground"
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
            <label htmlFor="description" className="text-sm font-medium text-muted-foreground">Description</label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors min-h-[100px] resize-y"
              placeholder="Décrivez votre entreprise et vos services..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ville" className="text-sm font-medium text-muted-foreground">Ville *</label>
              <input
                id="ville"
                {...register("ville")}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
                placeholder="Douala"
              />
              {errors.ville && (
                <p className="text-xs text-destructive">{errors.ville.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="quartier" className="text-sm font-medium text-muted-foreground">Quartier</label>
              <input
                id="quartier"
                {...register("quartier")}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
                placeholder="Akwa"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adresse" className="text-sm font-medium text-muted-foreground">Adresse complète</label>
            <input
              id="adresse"
              {...register("adresse")}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
              placeholder="Rue de l'Hôpital, face pharmacie..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="telephone" className="text-sm font-medium text-muted-foreground">Téléphone</label>
              <input
                id="telephone"
                {...register("telephone")}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email professionnel</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
                placeholder="contact@entreprise.cm"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="siteWeb" className="text-sm font-medium text-muted-foreground">Site web</label>
            <input
              id="siteWeb"
              {...register("siteWeb")}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-colors"
              placeholder="https://www.entreprise.cm"
            />
            {errors.siteWeb && (
              <p className="text-xs text-destructive">{errors.siteWeb.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit button with loading step indicator */}
      <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        {isLoading && loadingStep ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#6366F1" }} />
            <span>{loadingStep}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {logoFile || coverFile ? "⚠️ Images non sauvegardées" : "Toutes les modifications seront enregistrées"}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 shrink-0"
          style={{ backgroundColor: isLoading ? "#6366F1aa" : "#6366F1" }}
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
  );
}
