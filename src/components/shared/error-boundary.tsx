"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl scale-150" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] text-foreground mb-2">
        Oups ! Une erreur est survenue
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {error.message || "Quelque chose s'est mal passé. Veuillez réessayer."}
      </p>
      <Button
        onClick={reset}
        className="bg-indigo hover:bg-indigo/90 text-white rounded-xl px-6 gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Réessayer
      </Button>
    </div>
  );
}
