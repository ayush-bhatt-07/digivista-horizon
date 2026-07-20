import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Plus, Download, QrCode } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTable, type Column } from "@/components/data/data-table";
import { FilterBar } from "@/components/data/filter-bar";
import { useData } from "@/lib/data/store";
import { fmtDate, healthTone } from "@/lib/data/helpers";
import type { Asset, AssetCategory, AssetStatus } from "@/lib/data/types";

export const Route = createFileRoute("/assets")({
  head: () => ({ meta: [{ title: "Assets — Digivista Console" }] }),
  component: AssetsPage,
});

const STATUS_COLOR: Record<AssetStatus, string> = {
  operational: "bg-success/15 text-success-foreground ring-success/30",
  maintenance: "bg-warning/20 text-warning-foreground ring-warning/40",
  faulty: "bg-destructive/15 text-destructive ring-destructive/30",
  retired: "bg-muted text-muted-foreground ring-border",
};

function AssetsPage() {
  const { assets, branches, engineers } = useData();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Asset | null>(null);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return assets.items.filter((a) =>
      (category === "all" || a.category === category) &&
      (status === "all" || a.status === status) &&
      (!query || a.model.toLowerCase().includes(query) || a.serial.toLowerCase().includes(query))
    );
  }, [assets.items, q, category, status]);

  const bName = (id: string) => branches.items.find((b) => b.id === id)?.name ?? "—";
  const eName = (id: string) => engineers.items.find((e) => e.id === id)?.name ?? "—";

  const columns: Column<Asset>[] = [
    { key: "id", header: "Asset", cell: (r) => (
      <div>
        <div className="text-sm font-medium">{r.model}</div>
        <div className="font-mono text-xs text-muted-foreground">{r.serial}</div>
      </div>
    ) },
    { key: "cat", header: "Category", sortable: true, sortValue: (r) => r.category, cell: (r) => <Badge variant="outline" className="text-[10px]">{r.category}</Badge> },
    { key: "branch", header: "Branch", cell: (r) => <span className="text-sm">{bName(r.branchId)}</span> },
    { key: "eng", header: "Engineer", cell: (r) => <span className="text-sm text-muted-foreground">{eName(r.engineerId)}</span> },
    { key: "warranty", header: "Warranty until", sortable: true, sortValue: (r) => r.warrantyUntil, cell: (r) => <span className="text-xs">{fmtDate(r.warrantyUntil)}</span> },
    { key: "health", header: "Health", className: "text-right", sortable: true, sortValue: (r) => r.health, cell: (r) => <span className={`font-mono text-sm ${healthTone(r.health)}`}>{r.health}%</span> },
    { key: "status", header: "Status", cell: (r) => (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${STATUS_COLOR[r.status]}`}>{r.status}</span>
    ) },
  ];

  const cats: AssetCategory[] = ["CCTV", "NVR", "Biometric", "Router", "Switch", "Server", "UPS"];

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Every device deployed across all branches — with warranty, engineer and status."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Asset CSV exported")}><Download className="size-3.5" /> Export</Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("QR bulk print queued")}><QrCode className="size-3.5" /> Print QR</Button>
            <Button size="sm" onClick={() => toast.info("New asset drawer")}><Plus className="size-3.5" /> Add asset</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total assets" value={String(assets.items.length)} icon={Cpu} />
        <StatCard label="Operational" value={String(assets.items.filter((a) => a.status === "operational").length)} />
        <StatCard label="Faulty" value={String(assets.items.filter((a) => a.status === "faulty").length)} />
        <StatCard label="Warranty <30d" value={String(assets.items.filter((a) => (new Date(a.warrantyUntil).getTime() - Date.now()) / 86400000 < 30).length)} />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search by model or serial…" onReset={() => { setQ(""); setCategory("all"); setStatus("all"); }}>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="faulty">Faulty</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable columns={columns} data={filtered} onRowClick={setSelected} />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.model}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Info label="Serial" value={selected.serial} mono />
                  <Info label="Category" value={selected.category} />
                  <Info label="Branch" value={bName(selected.branchId)} />
                  <Info label="Engineer" value={eName(selected.engineerId)} />
                  <Info label="Installed" value={fmtDate(selected.installedOn)} />
                  <Info label="Warranty until" value={fmtDate(selected.warrantyUntil)} />
                  <Info label="Next PM" value={fmtDate(selected.nextMaintenance)} />
                  <Info label="Health" value={`${selected.health}%`} />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Service history</div>
                  <div className="mt-2 space-y-2">
                    {selected.history.map((h, i) => (
                      <div key={i} className="rounded-md border border-border p-2 text-xs">
                        <div className="text-muted-foreground">{fmtDate(h.date)}</div>
                        <div>{h.note}</div>
                      </div>
                    ))}
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

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono text-xs" : "text-sm"}>{value}</div>
    </div>
  );
}
