import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Plus, Trash2, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/data/data-table";
import { FilterBar } from "@/components/data/filter-bar";
import { ConfirmDialog } from "@/components/data/confirm-dialog";
import { useData } from "@/lib/data/store";
import { fmtDate } from "@/lib/data/helpers";
import type { Company, ContractStatus } from "@/lib/data/types";

export const Route = createFileRoute("/companies")({
  head: () => ({ meta: [{ title: "Companies — Digivista Console" }] }),
  component: CompaniesPage,
});

const STATUS_COLOR: Record<ContractStatus, string> = {
  active: "bg-success/15 text-success-foreground ring-success/30",
  expiring: "bg-warning/20 text-warning-foreground ring-warning/40",
  expired: "bg-destructive/15 text-destructive ring-destructive/30",
  trial: "bg-info/15 text-info-foreground ring-info/30",
};

function CompaniesPage() {
  const { companies } = useData();
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const industries = useMemo(() => Array.from(new Set(companies.items.map((c) => c.industry))).sort(), [companies.items]);
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return companies.items.filter((c) =>
      (industry === "all" || c.industry === industry) &&
      (status === "all" || c.contractStatus === status) &&
      (!query || c.name.toLowerCase().includes(query) || c.contact.toLowerCase().includes(query))
    );
  }, [companies.items, q, industry, status]);

  const columns: Column<Company>[] = [
    {
      key: "name", header: "Company", sortable: true, sortValue: (r) => r.name,
      cell: (r) => (
        <Link to="/companies/$id" params={{ id: r.id }} className="flex items-center gap-2 hover:underline">
          <span className="grid size-7 place-items-center rounded-md text-[10px] font-semibold text-white" style={{ backgroundColor: `oklch(0.55 0.12 ${r.logoHue})` }}>
            {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-foreground">{r.name}</div>
            <div className="truncate text-xs text-muted-foreground">{r.email}</div>
          </div>
        </Link>
      ),
    },
    { key: "industry", header: "Industry", sortable: true, sortValue: (r) => r.industry, cell: (r) => <span className="text-sm">{r.industry}</span> },
    { key: "contact", header: "Contact", cell: (r) => <span className="text-sm">{r.contact}</span> },
    { key: "branches", header: "Branches", className: "text-right", sortable: true, sortValue: (r) => r.branchIds.length, cell: (r) => <span className="font-mono text-sm">{r.branchIds.length}</span> },
    { key: "health", header: "Health", className: "text-right", sortable: true, sortValue: (r) => r.healthScore, cell: (r) => <span className="font-mono text-sm">{r.healthScore}%</span> },
    {
      key: "status", header: "Contract",
      cell: (r) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${STATUS_COLOR[r.contractStatus]}`}>
          {r.contractStatus}
        </span>
      ),
    },
    { key: "since", header: "Customer since", sortable: true, sortValue: (r) => r.customerSince, cell: (r) => <span className="text-xs text-muted-foreground">{fmtDate(r.customerSince)}</span> },
  ];

  const total = companies.items.length;
  const active = companies.items.filter((c) => c.contractStatus === "active").length;
  const expiring = companies.items.filter((c) => c.contractStatus === "expiring").length;
  const avgHealth = Math.round(companies.items.reduce((a, c) => a + c.healthScore, 0) / Math.max(1, total));

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Corporate customers, contracts and account health."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Export queued", { description: "CSV will download shortly." })}><Download className="size-3.5" /> Export</Button>
            <Button size="sm" onClick={() => toast.info("Create-company flow", { description: "Form opens in a drawer (wired to Supabase later)." })}><Plus className="size-3.5" /> New company</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total companies" value={String(total)} icon={Building2} />
        <StatCard label="Active contracts" value={String(active)} hint="Renewing this quarter" />
        <StatCard label="Expiring soon" value={String(expiring)} hint="Action required" />
        <StatCard label="Avg. health" value={`${avgHealth}%`} hint="Portfolio wide" />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search company or contact…" onReset={() => { setQ(""); setIndustry("all"); setStatus("all"); }}>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Industry" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All industries</SelectItem>
            {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Contract" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All contracts</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto font-mono text-[10px]">{filtered.length} results</Badge>
      </FilterBar>

      <DataTable
        columns={columns}
        data={filtered}
        selection={{
          selected,
          onChange: setSelected,
          bulkActions: (ids) => (
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-3" /> Delete {ids.length}
            </Button>
          ),
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete selected companies?"
        description="This will archive the records. Related branches and assets stay intact."
        destructive
        confirmLabel="Delete"
        onConfirm={() => {
          companies.removeMany(selected);
          toast.success(`${selected.length} companies deleted`);
          setSelected([]);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
