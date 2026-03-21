"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  showVille?: boolean;
  defaultQuery?: string;
  defaultVille?: string;
}

export function SearchBar({
  className,
  showVille = false,
  defaultQuery = "",
  defaultVille = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [ville, setVille] = useState(defaultVille);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (ville) params.set("ville", ville);
    router.push(`/entreprises?${params.toString()}`);
  }, [query, ville, router]);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch gap-2 w-full",
        className
      )}
    >
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-indigo transition-colors" />
        <Input
          type="text"
          placeholder="Rechercher un service, une entreprise..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-14 pl-12 pr-4 rounded-xl text-base border-border/50 bg-background/50 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo/20 focus:border-indigo focus:bg-background transition-all"
          aria-label="Rechercher une entreprise"
          id="search-entreprises"
        />
      </div>

      {showVille && (
        <div className="relative sm:w-52 group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-indigo transition-colors" />
          <Input
            type="text"
            placeholder="Ville (ex: Douala)"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-14 pl-12 pr-4 rounded-xl text-base border-border/50 bg-background/50 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo/20 focus:border-indigo focus:bg-background transition-all"
            aria-label="Filtrer par ville"
            id="search-ville"
          />
        </div>
      )}

      <Button
        onClick={handleSearch}
        className="h-14 px-8 rounded-xl bg-indigo hover:bg-indigo/90 text-white font-semibold text-base shadow-md shadow-indigo/20 transition-all gap-2"
      >
        <Search className="w-5 h-5" />
        <span className="hidden sm:inline">Rechercher</span>
      </Button>
    </div>
  );
}
