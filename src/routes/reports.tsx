import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download, Calendar, Play } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const REPORTS = [
  { id: "R-01", name: "Monthly SLA Report", description: "SLA adherence per company, per branch — with breach reasons.", schedule: "Monthly · 1st @ 08:00", format: "PDF" },
  { id: "R-02", name: "Engineer Performance", description: "Individual and team performance vs targets.", schedule: "Weekly · Monday", format: "PDF" },
  { id: "R-03", name: "Asset Health & Warranty", description: "Warranty exposure, health trend, expiry alerts.", schedule: "Monthly · 15th", format: "CSV" },
  { id: "R-04", name: "Fault Pattern Report", description: "Recurring failure categories & root causes.", schedule: "Bi-weekly", format: "PDF" },
  { id: "R-05", name: "Customer Satisfaction Index", description: "Executive CSAT rollup across accounts.", schedule: "Quarterly", format: "PDF" },
  { id: "R-06", name: "Compliance Audit Trail", description: "All verification submissions with proof-of-work.", schedule: "On-demand", format: "CSV" },
];

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Digivista Console" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Executive and operational reports — one-click download or schedule for delivery."
        actions={<Button variant="outline" size="sm"><Calendar className="size-3.5" /> Schedules</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Report templates" value={String(REPORTS.length)} icon={FileBarChart} />
        <StatCard label="Scheduled" value="4" hint="Auto-delivered" />
        <StatCard label="Generated (30d)" value="128" />
        <StatCard label="On-demand runs" value="42" hint="This week" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{r.description}</div>
              </div>
              <Badge variant="outline" className="text-[10px]">{r.format}</Badge>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Schedule · {r.schedule}</div>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" onClick={() => toast.success(`${r.name} queued`, { description: "You will receive the file shortly." })}>
                <Play className="size-3.5" /> Run now
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} downloaded`)}>
                <Download className="size-3.5" /> Download last
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
