"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Edit, X } from "lucide-react";
import { toast } from "sonner";
import {
  createService,
  updateService,
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
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");

  const resetForm = () => {
    setNom("");
    setDescription("");
    setPrix("");
    setEditingServiceId(null);
    setShowFormModal(false);
  };

  const handleEditClick = (service: Service) => {
    setNom(service.nom);
    setDescription(service.description || "");
    setPrix(service.prix !== null ? service.prix.toString() : "");
    setEditingServiceId(service.id);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const handleSubmitService = async () => {
    if (!nom.trim()) {
      toast.error("Le nom du service est requis");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nom: nom.trim(),
        description: description.trim() || undefined,
        prix: prix ? parseInt(prix, 10) : undefined,
        devise: "XAF",
      };

      if (editingServiceId) {
        // Update existing service
        const result = await updateService(editingServiceId, payload);
        if ("error" in result && result.error) {
          toast.error(result.error);
          setIsSubmitting(false);
          return;
        }

        if (result.data) {
          setServices((prev) =>
            prev.map((s) => (s.id === editingServiceId ? (result.data as Service) : s))
          );
        }
        toast.success("Service mis à jour !");
      } else {
        // Create new service
        const result = await createService(payload);
        if ("error" in result && result.error) {
          toast.error(result.error);
          setIsSubmitting(false);
          return;
        }

        if (result.data) {
          setServices((prev) => [result.data as Service, ...prev]);
        }
        toast.success("Service ajouté !");
      }

      resetForm();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    const result = await toggleServiceActive(id);
    if ("error" in result && result.error) {
      toast.error(result.error);
      // Revert optimism
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
      return;
    }
    toast.success("Statut mis à jour");
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    // Optimistic delete
    const backup = [...services];
    setServices((prev) => prev.filter((s) => s.id !== serviceToDelete));
    
    try {
      const result = await deleteService(serviceToDelete);
      if ("error" in result && result.error) {
        toast.error(result.error);
        setServices(backup);
      } else {
        toast.success("Service supprimé");
      }
    } catch {
      toast.error("Erreur lors de la suppression");
      setServices(backup);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  return (
    <div>
      {/* Header zone */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Services
        </h2>
        <button
          onClick={() => {
            setEditingServiceId(null);
            setNom("");
            setDescription("");
            setPrix("");
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau service
        </button>
      </div>

      {/* Table des services */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Prix</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.length > 0 ? (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors duration-100">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 line-clamp-1">{service.nom}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="text-gray-500 line-clamp-1">{service.description || "Aucune description"}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {service.prix !== null ? (
                      <span className="text-gray-900">
                        {service.prix.toLocaleString("fr-FR")} <span className="text-gray-500 text-xs">{service.devise}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Non spécifié</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(service.id)}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded transition-colors",
                        service.isActive
                          ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                          : "text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200"
                      )}
                    >
                      {service.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(service)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Éditer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(service.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                  Aucun service n'a été ajouté. Cliquez sur "Nouveau service" pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout/Modification Service */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-xl w-full max-w-md flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                {editingServiceId ? "Modifier le service" : "Nouveau service"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="service-nom" className="text-sm font-medium text-gray-700">Nom du service *</label>
                <input
                  id="service-nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Installation de plomberie"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="service-desc" className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="service-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[80px] resize-y"
                  placeholder="Détails du service..."
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="service-prix" className="text-sm font-medium text-gray-700">Prix indicatif (XAF)</label>
                <input
                  id="service-prix"
                  type="number"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="25000"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 rounded-b-md">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitService}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center w-28 h-9 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-xl w-full max-w-sm flex flex-col overflow-hidden">
            <div className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
              </p>
            </div>
            
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex-1"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
