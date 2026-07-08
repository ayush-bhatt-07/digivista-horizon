import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { KPI } from "@/lib/analytics/data";
import { cn } from "@/lib/utils";

export function KPICards({ kpis }: { kpis: KPI[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm"
        >
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {k.label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              {k.value}
            </div>
            {k.delta && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  k.trend === "up" ? "text-success" : "text-destructive",
                )}
              >
                {k.trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {k.delta}
              </span>
            )}
          </div>
          {k.hint && <div className="mt-1 text-xs text-muted-foreground">{k.hint}</div>}
          <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />
        </motion.div>
      ))}
    </div>
  );
}
