import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

const starSizes = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Note : ${rating} sur ${maxStars}`}
    >
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFull = i < fullStars;
        const isHalf = i === fullStars && hasHalf;

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onRate?.(i + 1)}
              className="hover:scale-125 transition-transform duration-150 focus:outline-none"
              aria-label={`Noter ${i + 1} étoile${i > 0 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  starSizes[size],
                  "transition-colors duration-150",
                  i < (rating || 0)
                    ? "fill-amber text-amber"
                    : "fill-none text-slate-300"
                )}
              />
            </button>
          );
        }

        if (isHalf) {
          return (
            <StarHalf
              key={i}
              className={cn(starSizes[size], "fill-amber text-amber")}
            />
          );
        }

        return (
          <Star
            key={i}
            className={cn(
              starSizes[size],
              isFull
                ? "fill-amber text-amber"
                : "fill-none text-slate-300"
            )}
          />
        );
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-mono font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
