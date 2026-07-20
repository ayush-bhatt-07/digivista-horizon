import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Plus, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/data/data-table";
import { FilterBar } from "@/components/data/filter-bar";
import { useData } from "@/lib/data/store";
import { fmtRelative, severityTone } from "@/lib/data/helpers";
import type { Fault, FaultCategory, Severity } from "@/lib/data/types";

export const Route = createFileRoute("/faults")({
  head: () => ({ meta: [{ title: "Faults — Digivista Console" }] }),
  component: FaultsPage,
});

function FaultsPage() {
  const { faults, branches } = useData();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return faults.items.filter((f) =>
      (category === "all" || f.category === category) &&
      (severity === "all" || f.severity === severity) &&
      (!query || f.rootCause.toLowerCase().includes(query) || f.id.toLowerCase().includes(query))
    );
  }, [faults.items, q, category, severity]);

  const bName = (id: string) => branches.items.find((b) => b.id === id)?.name ?? "—";

  const columns: Column<Fault>[] = [
    { key: "id", header: "Fault", cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "cat", header: "Category", sortable: true, sortValue: (r) => r.category, cell: (r) => <Badge variant="outline" className="text-[10px]">{r.category}</Badge> },
    { key: "sev", header: "Severity", cell: (r) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${severityTone[r.severity]}`}>{r.severity}</span>
    ) },
    { key: "branch", header: "Branch", cell: (r) => <span className="text-sm">{bName(r.branchId)}</span> },
    { key: "root", header: "Root cause", cell: (r) => <span className="text-sm text-muted-foreground">{r.rootCause}</span> },
    { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "resolved" ? "secondary" : "outline"} className="text-[10px]">{r.status}</Badge> },
    { key: "res", header: "Resolution", className: "font-mono text-xs", cell: (r) => r.resolutionTime },
    { key: "when", header: "Reported", cell: (r) => <span className="text-xs text-muted-foreground">{fmtRelative(r.reportedAt)}</span> },
  ];

  const byCat = useMemo(() => {
    const map = new Map<FaultCategory, number>();
    faults.items.forEach((f) => map.set(f.category, (map.get(f.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [faults.items]);

  return (
    <div>
      <PageHeader
        title="Faults"
        description="Recurring failure patterns, root causes and preventive maintenance triggers."
        actions={<Button size="sm" onClick={() => toast.info("Log fault flow")}><Plus className="size-3.5" /> Log fault</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total faults (30d)" value={String(faults.items.length)} icon={AlertTriangle} />
        <StatCard label="Critical" value={String(faults.items.filter((f) => f.severity === "critical").length)} />
        <StatCard label="Open" value={String(faults.items.filter((f) => f.status !== "resolved").length)} />
        <StatCard label="MTTR" value="4h 12m" icon={TrendingUp} />
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-3">
        {byCat.slice(0, 3).map(([cat, n]) => (
          <div key={cat} className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs uppercase text-muted-foreground">Top category</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-sm font-semibold">{cat}</div>
              <div className="font-mono text-lg">{n}</div>
            </div>
          </div>
        ))}
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search fault…" onReset={() => { setQ(""); setCategory("all"); setSeverity("all"); }}>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(["Hardware", "Software", "Network", "Power", "Camera", "NVR"] as FaultCategory[]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any severity</SelectItem>
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
