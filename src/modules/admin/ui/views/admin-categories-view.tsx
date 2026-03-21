"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, deleteCategory } from "@/modules/admin/server/actions";

interface Category {
  id: string;
  nom: string;
  slug: string;
  icon: string | null;
  couleur: string | null;
  description: string | null;
}

interface AdminCategoriesViewProps {
  initialCategories: Category[];
}

export function AdminCategoriesView({ initialCategories }: AdminCategoriesViewProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nom, setNom] = useState("");
  const [icon, setIcon] = useState("");
  const [couleur, setCouleur] = useState("#6366F1");

  const handleAdd = async () => {
    if (!nom.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCategory({
        nom: nom.trim(),
        icon: icon.trim() || undefined,
        couleur,
      });

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        setCategories((prev) => [...prev, result.data as Category]);
      }
      toast.success("Catégorie créée !");
      setNom("");
      setIcon("");
      setShowForm(false);
    } catch {
      toast.error("Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Catégorie supprimée");
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowForm(!showForm)}
        className="rounded-xl bg-indigo hover:bg-indigo/90 text-white gap-2"
      >
        <Plus className="w-4 h-4" />
        Ajouter une catégorie
      </Button>

      {showForm && (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label>Nom *</Label>
            <Input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="h-11 rounded-xl"
              placeholder="Construction"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icône Lucide</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="Building2"
              />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={couleur}
                  onChange={(e) => setCouleur(e.target.value)}
                  className="w-11 h-11 rounded-xl border border-border cursor-pointer"
                />
                <Input
                  value={couleur}
                  onChange={(e) => setCouleur(e.target.value)}
                  className="h-11 rounded-xl flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="rounded-xl bg-indigo hover:bg-indigo/90 text-white gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Créer
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cat.couleur || "#6366F1"}15` }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: cat.couleur || "#6366F1" }}
                >
                  {cat.nom.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{cat.nom}</p>
                <p className="text-xs text-muted-foreground">{cat.slug}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              aria-label={`Supprimer ${cat.nom}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
