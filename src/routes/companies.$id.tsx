import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, Phone, Mail, FileText, Users } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/data/store";
import { fmtDate } from "@/lib/data/helpers";

export const Route = createFileRoute("/companies/$id")({
  head: () => ({ meta: [{ title: "Company — Digivista Console" }] }),
  component: CompanyDetail,
});

function CompanyDetail() {
  const { id } = Route.useParams();
  const { companies, branches, assets, tickets } = useData();
  const company = companies.items.find((c) => c.id === id);
  if (!company) return <Navigate to="/companies" />;

  const cBranches = branches.items.filter((b) => b.companyId === company.id);
  const cAssets = assets.items.filter((a) => a.companyId === company.id);
  const cTickets = tickets.items.filter((t) => t.companyId === company.id);
  const openTickets = cTickets.filter((t) => t.status !== "closed" && t.status !== "resolved").length;

  return (
    <div>
      <PageHeader
        title={company.name}
        description={`${company.industry} · Customer since ${fmtDate(company.customerSince)}`}
        actions={<Button asChild variant="outline" size="sm"><Link to="/companies"><ArrowLeft className="size-3.5" /> Back</Link></Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Branches" value={String(cBranches.length)} icon={Building2} />
        <StatCard label="Assets" value={String(cAssets.length)} />
        <StatCard label="Open tickets" value={String(openTickets)} />
        <StatCard label="Health score" value={`${company.healthScore}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="branches">
          <TabsList>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>
          <TabsContent value="branches" className="mt-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {cBranches.map((b) => (
                <Link key={b.id} to="/branches/$id" params={{ id: b.id }} className="rounded-lg border border-border bg-card p-3 hover:border-primary/40">
                  <div className="text-sm font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.city}, {b.state} · {b.code}</div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{b.cameras} cameras · {b.nvrs} NVRs</span>
                    <Badge variant="outline" className="font-mono">{b.healthScore}%</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="assets" className="mt-3">
            <div className="rounded-lg border border-border bg-card p-3 text-sm">
              {cAssets.length} assets across all branches. Categories:{" "}
              {Array.from(new Set(cAssets.map((a) => a.category))).join(", ")}.
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="mt-3">
            <div className="space-y-2">
              {cTickets.slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
                  <div><span className="font-mono text-xs text-muted-foreground">{t.id}</span> · {t.title}</div>
                  <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="contracts" className="mt-3">
            <div className="rounded-lg border border-border bg-card p-4 text-sm">
              <div className="font-medium">{company.services.join(" · ")}</div>
              <div className="mt-1 text-muted-foreground">GST: <span className="font-mono">{company.gst}</span></div>
              <div className="mt-1 text-muted-foreground">Contract status: <span className="text-foreground">{company.contractStatus}</span></div>
            </div>
          </TabsContent>
        </Tabs>

        <aside className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Primary contact</div>
          <div className="flex items-center gap-2"><Users className="size-3.5 text-muted-foreground" /><span className="text-sm">{company.contact}</span></div>
          <div className="flex items-center gap-2"><Mail className="size-3.5 text-muted-foreground" /><span className="text-sm">{company.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="size-3.5 text-muted-foreground" /><span className="text-sm">{company.phone}</span></div>
          <div className="flex items-center gap-2"><FileText className="size-3.5 text-muted-foreground" /><span className="font-mono text-xs">{company.gst}</span></div>
        </aside>
      </div>
    </div>
  );
}
