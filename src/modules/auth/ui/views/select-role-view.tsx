"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, UserCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/modules/auth/server/actions";

export function SelectRoleView() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"client" | "entreprise">("client");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserRole(selectedRole);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Bienvenue sur BizConnect !");
      router.push(selectedRole === "entreprise" ? "/dashboard" : "/");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const isClient = selectedRole === "client";
  const isEntreprise = selectedRole === "entreprise";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#EEF2FF" }}
          >
            <Building2 className="w-7 h-7" style={{ color: "#6366F1" }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue sur BizConnect !
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Comment souhaitez-vous utiliser la plateforme ?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {/* Client */}
          <button
            type="button"
            onClick={() => setSelectedRole("client")}
            className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all"
            style={{
              backgroundColor: isClient ? "#EEF2FF" : "#FFFFFF",
              borderColor: isClient ? "#6366F1" : "#E5E7EB",
              boxShadow: isClient ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: isClient ? "#E0E7FF" : "#F3F4F6" }}
            >
              <UserCircle
                className="w-6 h-6"
                style={{ color: isClient ? "#6366F1" : "#9CA3AF" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">Je suis un client</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Je cherche des entreprises et des services
              </p>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{
                borderColor: isClient ? "#6366F1" : "#D1D5DB",
                backgroundColor: isClient ? "#6366F1" : "transparent",
              }}
            >
              {isClient && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Entreprise */}
          <button
            type="button"
            onClick={() => setSelectedRole("entreprise")}
            className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all"
            style={{
              backgroundColor: isEntreprise ? "#EEF2FF" : "#FFFFFF",
              borderColor: isEntreprise ? "#6366F1" : "#E5E7EB",
              boxShadow: isEntreprise ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: isEntreprise ? "#E0E7FF" : "#F3F4F6" }}
            >
              <Building2
                className="w-6 h-6"
                style={{ color: isEntreprise ? "#6366F1" : "#9CA3AF" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">Je suis une entreprise</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Je propose des services et veux être référencé
              </p>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{
                borderColor: isEntreprise ? "#6366F1" : "#D1D5DB",
                backgroundColor: isEntreprise ? "#6366F1" : "transparent",
              }}
            >
              {isEntreprise && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-50"
          style={{ backgroundColor: isLoading ? "#6366F1cc" : "#6366F1" }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Continuer
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
