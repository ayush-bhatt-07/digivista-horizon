import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ProtocolSlice } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";

const COLORS = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export function ResolutionDonut({ data }: { data: ProtocolSlice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ChartCard title="Issue Resolution Status" description="Ticket outcomes">
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8">
          <div className="text-center">
            <div className="font-mono text-2xl font-semibold text-foreground">{total}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
