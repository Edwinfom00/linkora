"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, UserCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/modules/auth/server/actions";
import { cn } from "@/lib/utils";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-indigo/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-indigo" />
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground">
            Bienvenue sur BizConnect !
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Comment souhaitez-vous utiliser la plateforme ?
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {/* Client option */}
          <button
            type="button"
            onClick={() => setSelectedRole("client")}
            className={cn(
              "w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-all",
              selectedRole === "client"
                ? "bg-indigo/5 border-indigo shadow-sm ring-1 ring-indigo/20"
                : "bg-card border-border hover:bg-muted/30 hover:border-border"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                selectedRole === "client"
                  ? "bg-indigo/10"
                  : "bg-muted"
              )}
            >
              <UserCircle
                className={cn(
                  "w-6 h-6",
                  selectedRole === "client" ? "text-indigo" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">Je suis un client</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Je cherche des entreprises et des services
              </p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                selectedRole === "client"
                  ? "border-indigo bg-indigo"
                  : "border-border"
              )}
            >
              {selectedRole === "client" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Entreprise option */}
          <button
            type="button"
            onClick={() => setSelectedRole("entreprise")}
            className={cn(
              "w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-all",
              selectedRole === "entreprise"
                ? "bg-indigo/5 border-indigo shadow-sm ring-1 ring-indigo/20"
                : "bg-card border-border hover:bg-muted/30 hover:border-border"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                selectedRole === "entreprise"
                  ? "bg-indigo/10"
                  : "bg-muted"
              )}
            >
              <Building2
                className={cn(
                  "w-6 h-6",
                  selectedRole === "entreprise" ? "text-indigo" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">Je suis une entreprise</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Je propose des services et veux être référencé
              </p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                selectedRole === "entreprise"
                  ? "border-indigo bg-indigo"
                  : "border-border"
              )}
            >
              {selectedRole === "entreprise" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold text-white bg-indigo hover:bg-indigo/90 rounded-xl transition-colors disabled:opacity-50"
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
