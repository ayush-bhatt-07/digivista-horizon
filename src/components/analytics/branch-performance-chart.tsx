import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BranchRating } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";

export function BranchPerformanceChart({ data }: { data: BranchRating[] }) {
  return (
    <ChartCard title="Branch-wise Ratings" description="Highest to lowest average rating">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="branch" width={78} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
            />
            <Bar dataKey="rating" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
