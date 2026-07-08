import { ChartCard } from "./chart-card";
import { cn } from "@/lib/utils";

function Cloud({ items, tone }: { items: { word: string; count: number }[]; tone: "positive" | "negative" }) {
  const max = Math.max(...items.map((i) => i.count));
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const scale = 0.8 + (it.count / max) * 0.6;
        return (
          <span
            key={it.word}
            style={{ fontSize: `${scale}rem` }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ring-1 ring-inset",
              tone === "positive"
                ? "bg-success/10 text-success ring-success/30"
                : "bg-destructive/10 text-destructive ring-destructive/30",
            )}
          >
            {it.word}
            <span className="rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{it.count}</span>
          </span>
        );
      })}
    </div>
  );
}

export function CommentAnalysis({
  positive,
  complaints,
}: {
  positive: { word: string; count: number }[];
  complaints: { word: string; count: number }[];
}) {
  return (
    <ChartCard title="Customer Comment Analysis" description="Most frequent themes in written feedback">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-success">Most Praised</h4>
          <Cloud items={positive} tone="positive" />
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-destructive">Most Complained</h4>
          <Cloud items={complaints} tone="negative" />
        </div>
      </div>
    </ChartCard>
  );
}
