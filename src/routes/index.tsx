import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, Cpu, Filter, Plus, TicketCheck } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { StatusChip } from "@/components/shell/status-chip";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useRole } from "@/lib/roles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Digivista Console" },
      { name: "description", content: "Operational overview of assets, tickets, and SLA health across your Digivista workspaces." },
      { property: "og:title", content: "Dashboard — Digivista Console" },
      { property: "og:description", content: "Operational overview of assets, tickets, and SLA health across your Digivista workspaces." },
    ],
  }),
  component: Dashboard,
});

const RECENT = [
  { id: "TCK-4821", asset: "HVAC-07 · BKC Tower", branch: "Mumbai — BKC", engineer: "D. Alvarez", status: "in_progress" as const, sla: "on_track" as const, opened: "12m ago" },
  { id: "TCK-4820", asset: "UPS-14 · Data Hall", branch: "Bengaluru — ORR", engineer: "S. Iyer",   status: "open"        as const, sla: "at_risk"  as const, opened: "38m ago" },
  { id: "TCK-4817", asset: "CRAC-02 · Server Room", branch: "Delhi — Aerocity", engineer: "R. Kaur",  status: "in_progress" as const, sla: "breached" as const, opened: "2h ago"  },
  { id: "TCK-4812", asset: "Generator-A · Rooftop", branch: "Chennai — Guindy", engineer: "K. Menon", status: "resolved"    as const, sla: "on_track" as const, opened: "5h ago"  },
  { id: "TCK-4805", asset: "Fire Panel · L4",       branch: "Pune — Hinjewadi",  engineer: "A. Rao",   status: "closed"      as const, sla: "on_track" as const, opened: "1d ago"  },
];

function Dashboard() {
  const { profile } = useRole();
  return (
    <>
      <PageHeader
        title={`Good afternoon, ${profile.name.split(" ")[0]}`}
        description="Live operational overview across your assigned workspaces."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="size-3.5" /> Filters
            </Button>
            <Button size="sm" className="h-9 gap-1.5">
              <Plus className="size-3.5" /> New ticket
            </Button>
          </>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open tickets"        value="128" delta="+4.2%" trend="up"   icon={TicketCheck} hint="vs. last 7 days" />
        <StatCard label="SLA breaches (24h)"  value="7"   delta="-12%"  trend="down" icon={AlertTriangle} hint="Rose region flagged" />
        <StatCard label="Assets monitored"    value="3,412" delta="+18" trend="up"   icon={Cpu} hint="Across 42 branches" />
        <StatCard label="Avg. resolution"     value="4h 12m" delta="-8m" trend="down" icon={Clock} hint="Field engineers" />
      </div>

      {/* Two-column: table + activity */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent tickets */}
        <section className="rounded-lg border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent tickets</h2>
              <p className="text-xs text-muted-foreground">Latest activity across your scope</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">View all</Button>
          </header>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-9 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">ID</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Asset</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Engineer</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="h-9 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">SLA</TableHead>
                  <TableHead className="h-9 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Opened</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer">
                    <TableCell className="font-mono text-xs text-accent">{r.id}</TableCell>
                    <TableCell className="text-sm">
                      <div className="font-medium text-foreground">{r.asset}</div>
                      <div className="text-xs text-muted-foreground">{r.branch}</div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{r.engineer}</TableCell>
                    <TableCell><StatusChip status={r.status} /></TableCell>
                    <TableCell><StatusChip status={r.sla} /></TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{r.opened}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Activity feed */}
        <aside className="rounded-lg border border-border bg-card">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Activity</h2>
            <p className="text-xs text-muted-foreground">Real-time system events</p>
          </header>
          <ol className="space-y-4 p-4">
            {[
              { icon: CheckCircle2, tone: "text-success", title: "TCK-4812 resolved", meta: "K. Menon · Chennai — Guindy · 6m ago" },
              { icon: AlertTriangle, tone: "text-destructive", title: "SLA breach on CRAC-02", meta: "Delhi — Aerocity · 34m ago" },
              { icon: TicketCheck, tone: "text-accent", title: "New ticket TCK-4821 assigned", meta: "D. Alvarez · 12m ago" },
              { icon: Cpu, tone: "text-info", title: "Asset UPS-14 registered", meta: "Bengaluru — ORR · 1h ago" },
              { icon: CheckCircle2, tone: "text-success", title: "Checklist CL-88 completed", meta: "Pune — Hinjewadi · 2h ago" },
            ].map((a, i) => (
              <li key={i} className="flex gap-3">
                <div className="mt-0.5">
                  <a.icon className={`size-4 ${a.tone}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{a.title}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{a.meta}</div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}
