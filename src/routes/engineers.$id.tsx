import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, Star, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/lib/data/store";

export const Route = createFileRoute("/engineers/$id")({
  head: () => ({ meta: [{ title: "Engineer — Digivista Console" }] }),
  component: EngineerDetail,
});

function EngineerDetail() {
  const { id } = Route.useParams();
  const { engineers, tickets, branches } = useData();
  const e = engineers.items.find((x) => x.id === id);
  if (!e) return <Navigate to="/engineers" />;
  const eTickets = tickets.items.filter((t) => t.engineerId === e.id);
  const eBranches = branches.items.filter((b) => e.branchIds.includes(b.id));

  return (
    <div>
      <PageHeader
        title={e.name}
        description={`${e.employeeId} · ${e.skillLevel} · ${e.experienceYears} years experience`}
        actions={<Button asChild variant="outline" size="sm"><Link to="/engineers"><ArrowLeft className="size-3.5" /> Back</Link></Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Rating" value={`${e.rating} ★`} icon={Star} />
        <StatCard label="Completed jobs" value={String(e.completedJobs)} />
        <StatCard label="Monthly score" value={`${e.monthlyScore}`} />
        <StatCard label="Availability" value={e.availability.replace("_", " ")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 text-sm font-semibold">Performance</div>
            <div className="space-y-3 text-sm">
              <Bar label="Compliance" value={e.compliance} />
              <Bar label="Training" value={e.training} />
              <Bar label="Attendance" value={e.attendance} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 text-sm font-semibold">Recent tickets</div>
            <div className="space-y-2">
              {eTickets.slice(0, 8).map((t) => (
                <Link key={t.id} to="/tickets" className="flex items-center justify-between rounded-md border border-border p-2 text-sm hover:border-primary/40">
                  <div><span className="font-mono text-xs text-muted-foreground">{t.id}</span> · {t.title}</div>
                  <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact</div>
          <div className="flex items-center gap-2"><Mail className="size-3.5 text-muted-foreground" /><span className="text-sm">{e.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="size-3.5 text-muted-foreground" /><span className="text-sm">{e.phone}</span></div>
          <div className="border-t border-border pt-2">
            <div className="text-xs text-muted-foreground">Assigned branches</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {eBranches.map((b) => <Link key={b.id} to="/branches/$id" params={{ id: b.id }}><Badge variant="secondary" className="text-[10px]">{b.name}</Badge></Link>)}
              {eBranches.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs"><span>{label}</span><span className="font-mono">{value}%</span></div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}
