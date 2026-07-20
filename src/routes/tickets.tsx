import { createFileRoute } from "@tanstack/react-router";
import { TicketCheck, Plus, LayoutGrid, Table as TableIcon, Filter, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { StatusChip } from "@/components/shell/status-chip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Column } from "@/components/data/data-table";
import { FilterBar } from "@/components/data/filter-bar";
import { useData } from "@/lib/data/store";
import { fmtRelative, priorityTone } from "@/lib/data/helpers";
import type { Ticket, TicketStatus, Priority } from "@/lib/data/types";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Tickets — Digivista Console" }] }),
  component: TicketsPage,
});

const COLUMNS: { key: TicketStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In progress" },
  { key: "waiting_parts", label: "Waiting parts" },
  { key: "resolved", label: "Resolved" },
];

function TicketsPage() {
  const { tickets, engineers, branches } = useData();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");
  const [engineer, setEngineer] = useState("all");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [comment, setComment] = useState("");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return tickets.items.filter((t) =>
      (priority === "all" || t.priority === priority) &&
      (engineer === "all" || t.engineerId === engineer) &&
      (!query || t.title.toLowerCase().includes(query) || t.id.toLowerCase().includes(query))
    );
  }, [tickets.items, q, priority, engineer]);

  const bName = (id: string) => branches.items.find((b) => b.id === id)?.name ?? "—";
  const eName = (id?: string) => (id ? engineers.items.find((e) => e.id === id)?.name : null) ?? "Unassigned";

  const cycleStatus = (t: Ticket) => {
    const order: TicketStatus[] = ["new", "assigned", "in_progress", "waiting_parts", "resolved", "closed"];
    const next = order[Math.min(order.indexOf(t.status) + 1, order.length - 1)];
    tickets.update(t.id, { status: next });
    toast.success(`Moved ${t.id} → ${next.replace("_", " ")}`);
  };

  const columns: Column<Ticket>[] = [
    { key: "id", header: "Ticket", cell: (r) => (
      <div>
        <div className="font-mono text-xs text-muted-foreground">{r.id}</div>
        <div className="text-sm font-medium">{r.title}</div>
      </div>
    ) },
    { key: "branch", header: "Branch", cell: (r) => <span className="text-sm">{bName(r.branchId)}</span> },
    { key: "engineer", header: "Engineer", cell: (r) => <span className="text-sm text-muted-foreground">{eName(r.engineerId)}</span> },
    { key: "priority", header: "Priority", cell: (r) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${priorityTone[r.priority]}`}>{r.priority}</span>
    ) },
    { key: "status", header: "Status", sortable: true, sortValue: (r) => r.status, cell: (r) => <Badge variant="outline" className="text-[10px]">{r.status.replace("_", " ")}</Badge> },
    { key: "sla", header: "SLA", cell: (r) => <StatusChip status={r.sla} /> },
    { key: "age", header: "Age", sortable: true, sortValue: (r) => r.createdAt, cell: (r) => <span className="text-xs text-muted-foreground">{fmtRelative(r.createdAt)}</span> },
  ];

  const stats = {
    total: tickets.items.length,
    open: tickets.items.filter((t) => t.status !== "closed" && t.status !== "resolved" && t.status !== "cancelled").length,
    breached: tickets.items.filter((t) => t.sla === "breached").length,
    critical: tickets.items.filter((t) => t.priority === "critical").length,
  };

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Service desk queue with Kanban workflow and list view."
        actions={
          <>
            <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
              <TabsList className="h-8">
                <TabsTrigger value="kanban" className="gap-1"><LayoutGrid className="size-3.5" /> Kanban</TabsTrigger>
                <TabsTrigger value="list" className="gap-1"><TableIcon className="size-3.5" /> List</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" onClick={() => toast.info("New-ticket drawer")}><Plus className="size-3.5" /> New ticket</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total tickets" value={String(stats.total)} icon={TicketCheck} />
        <StatCard label="Open" value={String(stats.open)} />
        <StatCard label="SLA breached" value={String(stats.breached)} hint="Escalate now" />
        <StatCard label="Critical" value={String(stats.critical)} />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search ticket or ID…" onReset={() => { setQ(""); setPriority("all"); setEngineer("all"); }}>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            {(["low", "medium", "high", "critical"] as Priority[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={engineer} onValueChange={setEngineer}>
          <SelectTrigger className="h-9 w-48"><SelectValue placeholder="Engineer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All engineers</SelectItem>
            {engineers.items.slice(0, 20).map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto gap-1 font-mono text-[10px]"><Filter className="size-3" />{filtered.length}</Badge>
      </FilterBar>

      {view === "kanban" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = filtered.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-foreground">{col.label}</div>
                  <Badge variant="outline" className="font-mono">{items.length}</Badge>
                </div>
                <div className="max-h-[560px] space-y-2 overflow-y-auto p-2">
                  {items.map((t) => (
                    <motion.button
                      key={t.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelected(t)}
                      className="block w-full rounded-md border border-border bg-card p-2.5 text-left text-xs shadow-sm transition hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] ring-1 ring-inset ${priorityTone[t.priority]}`}>{t.priority}</span>
                      </div>
                      <div className="mt-1 line-clamp-2 text-[13px] font-medium text-foreground">{t.title}</div>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="truncate">{bName(t.branchId)}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="size-2.5" />{fmtRelative(t.createdAt)}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} onRowClick={setSelected} />
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{selected.id}</span>
                  <span>{selected.title}</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selected.status.replace("_", " ")}</Badge>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${priorityTone[selected.priority]}`}>{selected.priority}</span>
                  <StatusChip status={selected.sla} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-[10px] uppercase text-muted-foreground">Branch</div>{bName(selected.branchId)}</div>
                  <div><div className="text-[10px] uppercase text-muted-foreground">Engineer</div>{eName(selected.engineerId)}</div>
                  <div><div className="text-[10px] uppercase text-muted-foreground">Created</div>{fmtRelative(selected.createdAt)}</div>
                  <div><div className="text-[10px] uppercase text-muted-foreground">ETA</div>{fmtRelative(selected.eta)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{selected.description}</p>
                <div>
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Activity</div>
                  <div className="space-y-2">
                    {selected.comments.map((c, i) => (
                      <div key={i} className="rounded-md border border-border p-2 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground"><span>{c.author}</span><span>{fmtRelative(c.at)}</span></div>
                        <div className="mt-1 text-foreground">{c.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Textarea placeholder="Add a comment…" value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-20" />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Button size="sm" onClick={() => { if (comment) { tickets.update(selected.id, { comments: [...selected.comments, { at: new Date().toISOString(), author: "You", text: comment }] }); setComment(""); toast.success("Comment added"); } }}>Comment</Button>
                    <Button size="sm" variant="outline" onClick={() => cycleStatus(selected)}>Advance status</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
