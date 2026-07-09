import logoAsset from "@/assets/digivista-logo.png.asset.json";
import { cn } from "@/lib/utils";

export const DIGIVISTA_LOGO_URL = logoAsset.url;

export function BrandLogo({
  className,
  variant = "full",
  alt = "Digivista Infotech",
}: {
  className?: string;
  variant?: "full" | "mark";
  alt?: string;
}) {
  // The uploaded artwork is a horizontal lockup. For the compact `mark`
  // variant we simply crop tightly via object-fit so the "DV" mark shows.
  return (
    <img
      src={DIGIVISTA_LOGO_URL}
      alt={alt}
      className={cn(
        "select-none",
        variant === "mark" ? "h-8 w-8 object-cover object-left" : "h-8 w-auto object-contain",
        className,
      )}
      draggable={false}
    />
  );
}
