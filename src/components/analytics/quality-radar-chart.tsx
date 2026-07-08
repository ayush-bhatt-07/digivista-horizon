import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { QualityFacet } from "@/lib/analytics/data";
import { ChartCard } from "./chart-card";

export function QualityRadarChart({ data }: { data: QualityFacet[] }) {
  return (
    <ChartCard title="Service Quality Radar" description="Average of all customer responses">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="facet" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
