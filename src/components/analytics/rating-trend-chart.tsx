import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";

export function RatingTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartCard title="Customer Satisfaction Trend" description="Average rating by month">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[3.5, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gradRating)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
