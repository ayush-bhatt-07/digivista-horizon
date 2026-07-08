import {
  BadgeCheck, Clock, HardHat, Sparkles, ShieldCheck, Wrench,
  type LucideIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ChecklistAnswers } from "@/lib/service-verification/warehouses";
import { cn } from "@/lib/utils";

type Q = {
  key: keyof ChecklistAnswers;
  icon: LucideIcon;
  question: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Q[] = [
  { key: "onTime", icon: Clock, question: "Was the engineer on time?", options: [
    { value: "yes", label: "Yes" }, { value: "no", label: "No" },
  ]},
  { key: "companyId", icon: BadgeCheck, question: "Did the engineer wear company ID?", options: [
    { value: "yes", label: "Yes" }, { value: "no", label: "No" },
  ]},
  { key: "safety", icon: HardHat, question: "Did the engineer follow safety protocols?", options: [
    { value: "excellent", label: "Excellent" }, { value: "good", label: "Good" },
    { value: "average", label: "Average" }, { value: "poor", label: "Poor" },
  ]},
  { key: "resolved", icon: Wrench, question: "Was the issue completely resolved?", options: [
    { value: "yes", label: "Yes" }, { value: "partially", label: "Partially" }, { value: "no", label: "No" },
  ]},
  { key: "cleaned", icon: Sparkles, question: "Was the work area cleaned?", options: [
    { value: "yes", label: "Yes" }, { value: "no", label: "No" },
  ]},
  { key: "successful", icon: ShieldCheck, question: "Was the service completed successfully?", options: [
    { value: "yes", label: "Yes" }, { value: "no", label: "No" },
  ]},
];

export function ChecklistSection({
  value,
  onChange,
}: {
  value: ChecklistAnswers;
  onChange: (patch: Partial<ChecklistAnswers>) => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Service verification checklist</h2>
        <p className="text-xs text-muted-foreground">
          Confirm each protocol point observed during the visit.
        </p>
      </header>
      <div className="grid gap-3 p-4 md:grid-cols-2">
        {QUESTIONS.map((q) => {
          const current = value[q.key] as string | null;
          return (
            <div
              key={q.key}
              className="rounded-md border border-border bg-background/40 p-4 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex items-start gap-2">
                <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <q.icon className="size-4" />
                </div>
                <div className="text-sm font-medium text-foreground">{q.question}</div>
              </div>
              <RadioGroup
                value={current ?? ""}
                onValueChange={(v) => onChange({ [q.key]: v } as Partial<ChecklistAnswers>)}
                className="flex flex-wrap gap-2"
              >
                {q.options.map((o) => {
                  const active = current === o.value;
                  return (
                    <Label
                      key={o.value}
                      htmlFor={`${q.key}-${o.value}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background hover:bg-secondary"
                      )}
                    >
                      <RadioGroupItem id={`${q.key}-${o.value}`} value={o.value} className="size-3.5" />
                      {o.label}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
          );
        })}
      </div>
    </section>
  );
}
