import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { ChartCard } from "./chart-card";

export function RecommendationGauge({ value }: { value: number }) {
  const data = [{ name: "score", value, fill: "hsl(var(--primary))" }];
  return (
    <ChartCard title="Recommendation Score" description="Would recommend Digivista">
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="55%" innerRadius="70%" outerRadius="100%" barSize={16} data={data} startAngle={210} endAngle={-30}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "hsl(var(--muted))" } as never} dataKey="value" cornerRadius={12} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6">
          <div className="font-mono text-4xl font-bold text-foreground">{value}%</div>
          <div className="mt-1 text-xs text-success">Excellent</div>
        </div>
      </div>
    </ChartCard>
  );
}
