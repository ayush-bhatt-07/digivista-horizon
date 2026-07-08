import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ProtocolSlice } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";

const COLORS = ["hsl(var(--success))", "hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export function ProtocolPieChart({ data, title = "Protocol Compliance", description = "Checklist adherence distribution" }: { data: ProtocolSlice[]; title?: string; description?: string }) {
  return (
    <ChartCard title={title} description={description}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={0} paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
