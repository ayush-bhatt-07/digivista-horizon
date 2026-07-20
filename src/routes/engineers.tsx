import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, Plus, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterBar } from "@/components/data/filter-bar";
import { useData } from "@/lib/data/store";
import type { Availability, SkillLevel } from "@/lib/data/types";

export const Route = createFileRoute("/engineers")({
  head: () => ({ meta: [{ title: "Engineers — Digivista Console" }] }),
  component: EngineersPage,
});

const AV_COLOR: Record<Availability, string> = {
  available: "bg-success",
  on_job: "bg-warning",
  off_duty: "bg-muted-foreground",
};

function EngineersPage() {
  const { engineers } = useData();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState<string>("all");
  const [av, setAv] = useState<string>("all");
  const [tab, setTab] = useState("grid");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return engineers.items.filter((e) =>
      (skill === "all" || e.skillLevel === skill) &&
      (av === "all" || e.availability === av) &&
      (!query || e.name.toLowerCase().includes(query) || e.employeeId.toLowerCase().includes(query))
    );
  }, [engineers.items, q, skill, av]);

  return (
    <div>
      <PageHeader
        title="Engineers"
        description="Field workforce, skills, ratings and current availability."
        actions={<Button size="sm" onClick={() => toast.info("Onboard-engineer drawer")}><Plus className="size-3.5" /> Onboard</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Active engineers" value={String(engineers.items.length)} icon={Wrench} />
        <StatCard label="Available now" value={String(engineers.items.filter((e) => e.availability === "available").length)} />
        <StatCard label="Avg rating" value={`${(engineers.items.reduce((s, e) => s + e.rating, 0) / engineers.items.length).toFixed(2)} ★`} />
        <StatCard label="Avg compliance" value={`${Math.round(engineers.items.reduce((s, e) => s + e.compliance, 0) / engineers.items.length)}%`} />
      </div>

      <FilterBar search={q} onSearch={setQ} placeholder="Search engineer or ID…" onReset={() => { setQ(""); setSkill("all"); setAv("all"); }}>
        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {(["L1", "L2", "L3", "Lead"] as SkillLevel[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={av} onValueChange={setAv}>
          <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any availability</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="on_job">On job</SelectItem>
            <SelectItem value="off_duty">Off duty</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-9"><TabsTrigger value="grid">Grid</TabsTrigger><TabsTrigger value="leader">Leaderboard</TabsTrigger></TabsList>
        </Tabs>
      </FilterBar>

      {tab === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Link key={e.id} to="/engineers/$id" params={{ id: e.id }} className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid size-10 place-items-center rounded-full bg-secondary font-semibold">{e.initials}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-card ${AV_COLOR[e.availability]}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.employeeId} · {e.skillLevel} · {e.experienceYears}y</div>
                </div>
                <Badge variant="outline" className="gap-1"><Star className="size-3 fill-amber-400 stroke-amber-400" />{e.rating}</Badge>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <MiniBar label="Compliance" value={e.compliance} />
                <MiniBar label="Training" value={e.training} />
                <MiniBar label="Attendance" value={e.attendance} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{e.currentTickets} open tickets</span>
                <span>{e.completedJobs} jobs</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-3">
          {[...filtered].sort((a, b) => b.monthlyScore - a.monthlyScore).slice(0, 20).map((e, i) => (
            <div key={e.id} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
              <div className="w-6 font-mono text-xs text-muted-foreground">#{i + 1}</div>
              <div className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">{e.initials}</div>
              <div className="min-w-0 flex-1"><div className="text-sm font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.skillLevel} · {e.completedJobs} jobs</div></div>
              <div className="w-24"><Progress value={e.monthlyScore} className="h-1.5" /></div>
              <div className="w-10 text-right font-mono text-sm">{e.monthlyScore}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>{label}</span><span className="font-mono">{value}%</span></div>
      <Progress value={value} className="h-1" />
    </div>
  );
}
