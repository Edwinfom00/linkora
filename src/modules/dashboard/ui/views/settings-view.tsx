"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { deleteMyAccount } from "@/modules/dashboard/server/account-actions";
import { signOut } from "@/lib/auth-client";

export function SettingsView({ userName }: { userName: string }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const expectedText = "SUPPRIMER";
  const canDelete = confirmText === expectedText;

  const handleDeleteAccount = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteMyAccount();

      if ("error" in result && result.error) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      // Sign out and redirect
      toast.success("Votre compte a été supprimé.");
      await signOut();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-display)] mb-6">
        Paramètres
      </h2>

      {/* Informations du compte */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-foreground pb-3 border-b border-border mb-4">
          Compte
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
            {userName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">Compte entreprise</p>
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="bg-card border border-red-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-red-100 mb-4">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-semibold text-red-600">Zone dangereuse</h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            La suppression de votre compte est <strong className="text-foreground">définitive et irréversible</strong>.
            Toutes vos données seront supprimées : votre entreprise, vos services,
            vos avis reçus, vos conversations et vos fichiers médias.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer mon compte
          </button>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-md flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Supprimer votre compte ?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Cette action supprimera <strong>définitivement</strong> votre compte,
                votre entreprise, tous vos services, avis et conversations.
                Il n'y a aucun moyen de récupérer vos données.
              </p>

              {/* Confirmation input */}
              <div className="w-full space-y-2 text-left">
                <label className="text-sm font-medium text-gray-700">
                  Tapez <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{expectedText}</span> pour confirmer :
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={expectedText}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors font-mono tracking-wider text-center"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!canDelete || isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
