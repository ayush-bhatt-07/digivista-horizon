import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Star } from "lucide-react";
import type { EngineerScore } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";
import { cn } from "@/lib/utils";

export function EngineerLeaderboardChart({ data }: { data: EngineerScore[] }) {
  return (
    <ChartCard title="Engineer Performance" description="Average customer rating">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
            <Bar dataKey="rating" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

const BADGE_STYLE: Record<string, string> = {
  gold: "bg-amber-500/15 text-amber-500 ring-amber-500/30",
  silver: "bg-slate-400/15 text-slate-300 ring-slate-400/30",
  bronze: "bg-orange-500/15 text-orange-500 ring-orange-500/30",
};

const MEDAL: Record<string, string> = { gold: "🥇", silver: "🥈", bronze: "🥉" };

export function EngineerLeaderboardCards({ data }: { data: EngineerScore[] }) {
  return (
    <ChartCard title="Top Engineers" description="Leaderboard by satisfaction">
      <ol className="space-y-2">
        {data.map((e, i) => (
          <li key={e.name} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="grid size-9 place-items-center rounded-md bg-secondary text-lg">
              {e.badge ? MEDAL[e.badge] : <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">{e.name}</span>
                {e.badge && (
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset", BADGE_STYLE[e.badge])}>
                    {e.badge}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {e.reviews} reviews · {e.compliance}% compliance
              </div>
            </div>
            <div className="flex items-center gap-1 font-mono text-sm font-semibold text-foreground">
              <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
              {e.rating.toFixed(1)}
            </div>
          </li>
        ))}
      </ol>
    </ChartCard>
  );
}
