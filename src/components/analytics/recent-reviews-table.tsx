import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecentReview, ReviewStatus } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";
import { cn } from "@/lib/utils";

const STATUS: Record<ReviewStatus, { label: string; className: string }> = {
  excellent: { label: "Excellent", className: "bg-success/15 text-success ring-success/30" },
  good:      { label: "Good",      className: "bg-primary/15 text-primary ring-primary/30" },
  follow_up: { label: "Needs Follow-up", className: "bg-warning/15 text-warning ring-warning/30" },
  critical:  { label: "Critical",  className: "bg-destructive/15 text-destructive ring-destructive/30" },
};

export function RecentReviewsTable({
  data,
  onOpen,
}: {
  data: RecentReview[];
  onOpen: (r: RecentReview) => void;
}) {
  return (
    <ChartCard title="Recent Reviews" description="Click a row to inspect the full submission">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Warehouse</th>
              <th className="py-2 pr-3 font-medium">Manager</th>
              <th className="py-2 pr-3 font-medium">Engineer</th>
              <th className="py-2 pr-3 font-medium">Rating</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Review</th>
              <th className="py-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => {
              const s = STATUS[r.status];
              return (
                <tr
                  key={r.id}
                  onClick={() => onOpen(r)}
                  className="cursor-pointer border-t border-border/60 transition hover:bg-muted/30"
                >
                  <td className="py-2.5 pr-3 whitespace-nowrap text-xs text-muted-foreground">{r.date}</td>
                  <td className="py-2.5 pr-3 font-medium text-foreground">{r.warehouse}</td>
                  <td className="py-2.5 pr-3 text-foreground/80">{r.manager}</td>
                  <td className="py-2.5 pr-3 text-foreground/80">{r.engineer}</td>
                  <td className="py-2.5 pr-3">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                      {r.rating}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset", s.className)}>
                      {s.label}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 max-w-[280px] truncate text-xs text-muted-foreground">{r.review}</td>
                  <td className="py-2.5 text-right">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onOpen(r); }}>
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
