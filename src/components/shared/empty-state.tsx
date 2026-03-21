import { Search, FolderOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: "search" | "folder" | "alert";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const icons = {
  search: Search,
  folder: FolderOpen,
  alert: AlertCircle,
};

export function EmptyState({
  icon = "search",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo/10 blur-xl scale-150" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo/20 to-cyan/20 flex items-center justify-center">
          <Icon className="w-10 h-10 text-indigo" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-indigo hover:bg-indigo/90 text-white rounded-xl px-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
