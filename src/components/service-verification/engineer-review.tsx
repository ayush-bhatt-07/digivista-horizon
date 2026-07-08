import type { EngineerRatings } from "@/lib/service-verification/warehouses";
import { RatingStars } from "./rating-stars";

const FIELDS: { key: keyof EngineerRatings; label: string }[] = [
  { key: "professionalism", label: "Professionalism" },
  { key: "technicalKnowledge", label: "Technical knowledge" },
  { key: "communication", label: "Communication" },
  { key: "behaviour", label: "Behaviour" },
  { key: "punctuality", label: "Punctuality" },
];

export function EngineerReview({
  value,
  onChange,
}: {
  value: EngineerRatings;
  onChange: (patch: Partial<EngineerRatings>) => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Engineer evaluation</h2>
        <p className="text-xs text-muted-foreground">
          Rate the engineer across five performance dimensions.
        </p>
      </header>
      <div className="divide-y divide-border">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="text-sm font-medium text-foreground">{f.label}</div>
            <RatingStars
              label={f.label}
              value={value[f.key]}
              onChange={(v) => onChange({ [f.key]: v } as Partial<EngineerRatings>)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
