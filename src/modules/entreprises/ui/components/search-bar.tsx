"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
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
      <div className="relative flex-1 group space-y-1.5">
        <label htmlFor="search-entreprises" className="sr-only">Rechercher</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Rechercher un service, une entreprise..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          id="search-entreprises"
        />
      </div>

      {showVille && (
        <div className="relative sm:w-52 group space-y-1.5">
          <label htmlFor="search-ville" className="sr-only">Ville</label>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Ville (ex: Douala)"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
            id="search-ville"
          />
        </div>
      )}

      <button
        onClick={handleSearch}
        className="inline-flex items-center justify-center gap-2 px-4 h-10 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Rechercher</span>
      </button>
    </div>
  );
}
