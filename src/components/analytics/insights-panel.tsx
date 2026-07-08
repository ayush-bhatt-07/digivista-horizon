import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function InsightsPanel({ insights }: { insights: string[] }) {
  return (
    <div className="sticky top-4 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/70 to-accent/5 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid size-7 place-items-center rounded-md bg-primary/15 text-primary">
          <Sparkles className="size-3.5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Observations</h3>
          <p className="text-[11px] text-muted-foreground">Auto-generated from latest reviews</p>
        </div>
      </div>
      <ul className="space-y-2">
        {insights.map((line, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-lg border border-border/60 bg-background/40 p-2.5 text-xs leading-relaxed text-foreground/90"
          >
            {line}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
