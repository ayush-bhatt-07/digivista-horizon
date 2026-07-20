import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, User, Phone, Cpu } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/lib/data/store";
import { fmtDate, fmtRelative, healthTone } from "@/lib/data/helpers";

export const Route = createFileRoute("/branches/$id")({
  head: () => ({ meta: [{ title: "Branch — Digivista Console" }] }),
  component: BranchDetail,
});

function BranchDetail() {
  const { id } = Route.useParams();
  const { branches, assets, tickets, engineers, companies } = useData();
  const branch = branches.items.find((b) => b.id === id);
  if (!branch) return <Navigate to="/branches" />;
  const bAssets = assets.items.filter((a) => a.branchId === branch.id);
  const bTickets = tickets.items.filter((t) => t.branchId === branch.id);
  const eng = engineers.items.find((e) => e.id === branch.assignedEngineerId);
  const comp = companies.items.find((c) => c.id === branch.companyId);

  return (
    <div>
      <PageHeader
        title={branch.name}
        description={`${comp?.name ?? ""} · ${branch.code}`}
        actions={<Button asChild variant="outline" size="sm"><Link to="/branches"><ArrowLeft className="size-3.5" /> Back</Link></Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Cameras" value={String(branch.cameras)} icon={Cpu} />
        <StatCard label="NVRs" value={String(branch.nvrs)} />
        <StatCard label="Open tickets" value={String(bTickets.filter((t) => t.status !== "closed" && t.status !== "resolved").length)} />
        <StatCard label="Health" value={`${branch.healthScore}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="assets">
          <TabsList>
            <TabsTrigger value="assets">Assets ({bAssets.length})</TabsTrigger>
            <TabsTrigger value="tickets">Tickets ({bTickets.length})</TabsTrigger>
            <TabsTrigger value="visits">Recent visits</TabsTrigger>
          </TabsList>
          <TabsContent value="assets" className="mt-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {bAssets.map((a) => (
                <div key={a.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{a.model}</div>
                    <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.category} · <span className="font-mono">{a.serial}</span></div>
                  <div className="mt-2 text-xs">Health: <span className={`font-mono ${healthTone(a.health)}`}>{a.health}%</span></div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="mt-3">
            <div className="space-y-2">
              {bTickets.slice(0, 12).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
                  <div><span className="font-mono text-xs text-muted-foreground">{t.id}</span> · {t.title}</div>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="visits" className="mt-3">
            <div className="rounded-lg border border-border bg-card p-4 text-sm">
              Last engineer visit: <span className="font-medium">{fmtDate(branch.lastVisit)}</span> ({fmtRelative(branch.lastVisit)}).
            </div>
          </TabsContent>
        </Tabs>

        <aside className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Site</div>
          <div className="flex items-center gap-2"><MapPin className="size-3.5 text-muted-foreground" /><span className="text-sm">{branch.address}</span></div>
          <div className="flex items-center gap-2"><User className="size-3.5 text-muted-foreground" /><span className="text-sm">{branch.contactPerson}</span></div>
          <div className="flex items-center gap-2"><Phone className="size-3.5 text-muted-foreground" /><span className="text-sm">{branch.phone}</span></div>
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">Assigned engineer</div>
            <Link to="/engineers/$id" params={{ id: eng?.id ?? "" }} className="mt-1 flex items-center gap-2 text-sm font-medium hover:underline">
              <span className="grid size-7 place-items-center rounded-md bg-secondary text-xs font-semibold">{eng?.initials}</span>
              {eng?.name}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
