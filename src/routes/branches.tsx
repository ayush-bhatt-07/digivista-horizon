import { createFileRoute, Link } from "@tanstack/react-router";
import { Network, Plus, Download, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/data/data-table";
import { FilterBar } from "@/components/data/filter-bar";
import { useData } from "@/lib/data/store";
import { fmtDate, healthTone } from "@/lib/data/helpers";
import type { Branch } from "@/lib/data/types";

export const Route = createFileRoute("/branches")({
  head: () => ({ meta: [{ title: "Branches — Digivista Console" }] }),
  component: BranchesPage,
});

function BranchesPage() {
  const { branches, companies, engineers } = useData();
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("all");
  const [state, setState] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const states = useMemo(() => Array.from(new Set(branches.items.map((b) => b.state))).sort(), [branches.items]);
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return branches.items.filter((b) =>
      (company === "all" || b.companyId === company) &&
      (state === "all" || b.state === state) &&
      (!query || b.name.toLowerCase().includes(query) || b.city.toLowerCase().includes(query) || b.code.toLowerCase().includes(query))
    );
  }, [branches.items, q, company, state]);

  const cName = (id: string) => companies.items.find((c) => c.id === id)?.name ?? "—";
  const eName = (id: string) => engineers.items.find((e) => e.id === id)?.name ?? "Unassigned";

  const columns: Column<Branch>[] = [
    { key: "name", header: "Branch", sortable: true, sortValue: (r) => r.name,
      cell: (r) => (
        <Link to="/branches/$id" params={{ id: r.id }} className="hover:underline">
          <div className="text-sm font-medium">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.code} · {cName(r.companyId)}</div>
        </Link>
      ),
    },
    { key: "location", header: "Location", cell: (r) => <span className="inline-flex items-center gap-1 text-sm"><MapPin className="size-3 text-muted-foreground" /> {r.city}, {r.state}</span> },
    { key: "engineer", header: "Assigned engineer", cell: (r) => <span className="text-sm">{eName(r.assignedEngineerId)}</span> },
    { key: "cameras", header: "Devices", className: "text-right", sortable: true, sortValue: (r) => r.cameras, cell: (r) => <span className="font-mono text-sm">{r.cameras} cams · {r.nvrs} NVR</span> },
    { key: "health", header: "Health", className: "text-right", sortable: true, sortValue: (r) => r.healthScore,
      cell: (r) => <span className={`font-mono text-sm ${healthTone(r.healthScore)}`}>{r.healthScore}%</span> },
    { key: "open", header: "Open tickets", className: "text-right", sortable: true, sortValue: (r) => r.openTickets, cell: (r) => <Badge variant={r.openTickets > 3 ? "destructive" : "outline"} className="font-mono">{r.openTickets}</Badge> },
    { key: "visit", header: "Last visit", sortable: true, sortValue: (r) => r.lastVisit, cell: (r) => <span className="text-xs text-muted-foreground">{fmtDate(r.lastVisit)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Branches"
        description="Site inventory, device counts and on-site coverage."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Branch CSV exported")}><Download className="size-3.5" /> Export</Button>
            <Button size="sm" onClick={() => toast.info("New-branch drawer")}><Plus className="size-3.5" /> New branch</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total branches" value={String(branches.items.length)} icon={Network} />
        <StatCard label="States covered" value={String(states.length)} />
        <StatCard label="Cameras deployed" value={String(branches.items.reduce((s, b) => s + b.cameras, 0))} />
        <StatCard label="Avg. health" value={`${Math.round(branches.items.reduce((s, b) => s + b.healthScore, 0) / Math.max(1, branches.items.length))}%`} />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search branch, code or city…" onReset={() => { setQ(""); setCompany("all"); setState("all"); }}>
        <Select value={company} onValueChange={setCompany}>
          <SelectTrigger className="h-9 w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All companies</SelectItem>
            {companies.items.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Tabs value={view} onValueChange={(v) => setView(v as "table" | "grid")}>
          <TabsList className="h-9"><TabsTrigger value="table">Table</TabsTrigger><TabsTrigger value="grid">Grid</TabsTrigger></TabsList>
        </Tabs>
      </FilterBar>

      {view === "table" ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 24).map((b) => (
            <Link key={b.id} to="/branches/$id" params={{ id: b.id }} className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.city}, {b.state}</div>
                </div>
                <Badge variant="outline" className={`font-mono ${healthTone(b.healthScore)}`}>{b.healthScore}%</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{b.cameras} cams · {b.nvrs} NVRs</span>
                <span>{b.openTickets} open</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
