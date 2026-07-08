import { FileText, Image as ImageIcon, Star } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RecentReview } from "@/lib/analytics/data";
import { cn } from "@/lib/utils";

export function ReviewDetailsDrawer({
  review,
  open,
  onOpenChange,
}: {
  review: RecentReview | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        {review && (
          <>
            <SheetHeader className="border-b border-border pb-4">
              <SheetTitle className="flex items-center gap-2">
                <span>Review {review.id}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/30">
                  <Star className="size-3 fill-amber-400 stroke-amber-400" /> {review.rating}/5
                </span>
              </SheetTitle>
              <SheetDescription>
                {review.warehouse} · Manager {review.manager} · Engineer {review.engineer}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 py-5">
              <Section title="Submission">
                <Kv label="Submitted at" value={new Date(review.submittedAt).toLocaleString()} />
                <Kv label="Warehouse" value={review.warehouse} />
                <Kv label="Engineer" value={review.engineer} />
                <Kv label="Manager" value={review.manager} />
              </Section>

              <Section title="Checklist answers">
                <ul className="space-y-1.5">
                  {review.answers.map((a, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-background/40 p-2 text-xs">
                      <span className="text-muted-foreground">{a.question}</span>
                      <span className={cn(
                        "font-medium",
                        a.answer === "Yes" && "text-success",
                        a.answer === "No" && "text-destructive",
                        a.answer === "Partial" && "text-warning",
                      )}>{a.answer}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Engineer ratings">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(review.ratings).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 p-2 text-xs">
                      <span className="capitalize text-muted-foreground">{k}</span>
                      <span className="inline-flex items-center gap-1 font-mono font-medium text-foreground">
                        <Star className="size-3 fill-amber-400 stroke-amber-400" /> {v}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Proof of work">
                <div className="flex flex-wrap gap-2">
                  {review.proofs.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs">
                      {p.kind === "photo" ? <ImageIcon className="size-3.5 text-muted-foreground" /> : <FileText className="size-3.5 text-muted-foreground" />}
                      <span className="text-foreground">{p.name}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Customer review">
                <p className="rounded-md border border-border/60 bg-background/40 p-3 text-xs italic text-foreground/90">"{review.review}"</p>
              </Section>

              <Section title="Manager comment">
                <p className="rounded-md border border-border/60 bg-background/40 p-3 text-xs text-foreground/90">{review.managerComment}</p>
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </section>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 p-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
