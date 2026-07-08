import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  onChange,
  size = "md",
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "md" | "lg";
  label?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const dim = size === "lg" ? "size-7" : "size-5";
  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= shown;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(i)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star
              className={cn(
                dim,
                "transition-colors",
                active ? "fill-warning text-warning" : "text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
      {size === "lg" && (
        <span className="ml-3 font-mono text-sm text-muted-foreground">
          {value.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}
