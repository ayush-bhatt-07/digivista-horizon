import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { WarehouseCard } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";
import { cn } from "@/lib/utils";

const HEALTH: Record<string, { ring: string; bg: string; dot: string; label: string }> = {
  excellent: { ring: "ring-success/40", bg: "bg-success/10", dot: "bg-success", label: "Excellent" },
  average:   { ring: "ring-warning/40", bg: "bg-warning/10", dot: "bg-warning", label: "Average" },
  attention: { ring: "ring-destructive/40", bg: "bg-destructive/10", dot: "bg-destructive", label: "Needs Attention" },
};

export function WarehouseHeatmap({ data }: { data: WarehouseCard[] }) {
  return (
    <ChartCard title="Warehouse Heatmap" description="Click a warehouse for detailed analytics">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {data.map((w, i) => {
          const style = HEALTH[w.health];
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to="/service-analytics/$warehouse"
                params={{ warehouse: w.id }}
                className={cn("group block rounded-xl p-3 ring-1 ring-inset transition hover:scale-[1.02]", style.bg, style.ring)}
              >
                <div className="flex items-center gap-1.5">
                  <span className={cn("size-1.5 rounded-full", style.dot)} />
                  <span className="text-xs font-medium text-foreground">{w.name}</span>
                </div>
                <div className="mt-2 font-mono text-lg font-semibold text-foreground">{w.rating.toFixed(1)}★</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">{w.reviews} reviews · {style.label}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </ChartCard>
  );
}
