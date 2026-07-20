import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Download } from "lucide-react";
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
import { fmtDateTime } from "@/lib/data/helpers";
import type { AuditLog } from "@/lib/data/types";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit log — Digivista Console" }] }),
  component: AuditPage,
});

const ACTION_COLOR: Record<string, string> = {
  login: "bg-info/15 text-info-foreground ring-info/30",
  edit: "bg-accent/15 text-accent-foreground ring-accent/30",
  delete: "bg-destructive/15 text-destructive ring-destructive/30",
  role_change: "bg-warning/20 text-warning-foreground ring-warning/40",
  ticket_update: "bg-muted text-muted-foreground ring-border",
  verification: "bg-success/15 text-success-foreground ring-success/30",
  asset_created: "bg-secondary text-secondary-foreground ring-border",
  company_added: "bg-secondary text-secondary-foreground ring-border",
};

function AuditPage() {
  const { audit } = useData();
  const [q, setQ] = useState("");
  const [action, setAction] = useState("all");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return audit.items.filter((l) =>
      (action === "all" || l.action === action) &&
      (!query || l.actor.toLowerCase().includes(query) || l.entity.toLowerCase().includes(query) || l.detail.toLowerCase().includes(query))
    );
  }, [audit.items, q, action]);

  const columns: Column<AuditLog>[] = [
    { key: "at", header: "Timestamp", sortable: true, sortValue: (r) => r.at, cell: (r) => <span className="font-mono text-xs">{fmtDateTime(r.at)}</span> },
    { key: "actor", header: "Actor", cell: (r) => <span className="text-sm">{r.actor}</span> },
    { key: "action", header: "Action", cell: (r) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${ACTION_COLOR[r.action]}`}>{r.action.replace("_", " ")}</span>
    ) },
    { key: "entity", header: "Entity", className: "font-mono text-xs", cell: (r) => r.entity },
    { key: "detail", header: "Detail", cell: (r) => <span className="text-sm text-muted-foreground">{r.detail}</span> },
    { key: "id", header: "Log ID", className: "font-mono text-[10px] text-muted-foreground", cell: (r) => r.id },
  ];

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Immutable, tamper-evident trail of every action performed in the console."
        actions={<Button variant="outline" size="sm" onClick={() => toast.success("Audit CSV exported")}><Download className="size-3.5" /> Export</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Events (30d)" value={String(audit.items.length)} icon={ShieldCheck} />
        <StatCard label="Unique actors" value={String(new Set(audit.items.map((l) => l.actor)).size)} />
        <StatCard label="Deletions" value={String(audit.items.filter((l) => l.action === "delete").length)} />
        <StatCard label="Role changes" value={String(audit.items.filter((l) => l.action === "role_change").length)} />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search actor, entity or detail…" onReset={() => { setQ(""); setAction("all"); }}>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {Object.keys(ACTION_COLOR).map((a) => <SelectItem key={a} value={a}>{a.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto font-mono text-[10px]">{filtered.length}</Badge>
      </FilterBar>

      <DataTable columns={columns} data={filtered} pageSize={15} />
    </div>
  );
}
