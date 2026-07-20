import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, Plus, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Template {
  id: string;
  name: string;
  category: "Preventive" | "Installation" | "Audit" | "Verification";
  version: string;
  itemsCount: number;
  items: { id: string; label: string; required: boolean }[];
}

const TEMPLATES: Template[] = [
  { id: "T-101", name: "CCTV Preventive Maintenance", category: "Preventive", version: "v3.2", itemsCount: 12, items: [
    { id: "i1", label: "Camera lens cleaning", required: true },
    { id: "i2", label: "Focus & angle check", required: true },
    { id: "i3", label: "Power cable inspection", required: true },
    { id: "i4", label: "NVR recording verification", required: true },
    { id: "i5", label: "Firmware version check", required: false },
    { id: "i6", label: "Network switch status", required: true },
    { id: "i7", label: "UPS load test", required: false },
    { id: "i8", label: "Cable management", required: false },
    { id: "i9", label: "Housing / enclosure integrity", required: true },
    { id: "i10", label: "Motion detection zones", required: false },
    { id: "i11", label: "Storage utilization report", required: true },
    { id: "i12", label: "Customer sign-off collected", required: true },
  ]},
  { id: "T-102", name: "Biometric Installation", category: "Installation", version: "v2.1", itemsCount: 9, items: [
    { id: "i1", label: "Mounting alignment", required: true },
    { id: "i2", label: "Power supply certified", required: true },
    { id: "i3", label: "Network reachability", required: true },
    { id: "i4", label: "Enrollment test — 3 users", required: true },
    { id: "i5", label: "Attendance sync test", required: true },
    { id: "i6", label: "Anti-tamper enabled", required: true },
    { id: "i7", label: "Admin credential handover", required: true },
    { id: "i8", label: "User training completed", required: false },
    { id: "i9", label: "Warranty registered", required: true },
  ]},
  { id: "T-103", name: "Compliance Audit — Bank Branch", category: "Audit", version: "v1.4", itemsCount: 10, items: [
    { id: "i1", label: "Vault camera coverage", required: true },
    { id: "i2", label: "ATM lobby coverage", required: true },
    { id: "i3", label: "30-day retention verified", required: true },
    { id: "i4", label: "Access control log review", required: true },
    { id: "i5", label: "Panic button test", required: true },
    { id: "i6", label: "Fire alarm integration", required: false },
    { id: "i7", label: "Signage compliance", required: false },
    { id: "i8", label: "IT room lock inspection", required: true },
    { id: "i9", label: "Data privacy notice posted", required: true },
    { id: "i10", label: "Auditor sign-off", required: true },
  ]},
  { id: "T-104", name: "Service Verification (post-visit)", category: "Verification", version: "v4.0", itemsCount: 7, items: [
    { id: "i1", label: "Engineer arrived on time", required: true },
    { id: "i2", label: "PPE used correctly", required: true },
    { id: "i3", label: "Issue explained clearly", required: true },
    { id: "i4", label: "Site left clean", required: true },
    { id: "i5", label: "Issue fully resolved", required: true },
    { id: "i6", label: "Handover documentation shared", required: true },
    { id: "i7", label: "Customer satisfaction captured", required: true },
  ]},
];

export const Route = createFileRoute("/checklists")({
  head: () => ({ meta: [{ title: "Checklists — Digivista Console" }] }),
  component: ChecklistsPage,
});

function ChecklistsPage() {
  const [active, setActive] = useState<Template>(TEMPLATES[0]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const done = Object.values(checked).filter(Boolean).length;
  const total = active.items.length;

  return (
    <div>
      <PageHeader
        title="Checklists"
        description="Reusable protocols for preventive maintenance, installations, audits and verifications."
        actions={<Button size="sm" onClick={() => toast.info("New template drawer")}><Plus className="size-3.5" /> New template</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Templates" value={String(TEMPLATES.length)} icon={ClipboardCheck} />
        <StatCard label="Categories" value="4" />
        <StatCard label="Avg. items" value={String(Math.round(TEMPLATES.reduce((s, t) => s + t.itemsCount, 0) / TEMPLATES.length))} />
        <StatCard label="Compliance rate" value="95%" hint="Last 30 days" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActive(t); setChecked({}); }}
              className={`w-full rounded-lg border p-3 text-left transition ${active.id === t.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{t.name}</div>
                <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.itemsCount} items · {t.version}</span>
                <span className="font-mono">{t.id}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{active.name}</div>
              <div className="text-xs text-muted-foreground">{active.category} · {active.version}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">{done}/{total}</Badge>
              <Button variant="outline" size="sm" onClick={() => toast.success("Template duplicated")}><Copy className="size-3.5" /> Duplicate</Button>
            </div>
          </div>

          <Tabs defaultValue="items" className="mt-4">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="usage">Recent usage</TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="mt-3">
              <div className="divide-y divide-border rounded-md border border-border">
                {active.items.map((it, i) => (
                  <label key={it.id} className="flex cursor-pointer items-center gap-3 p-3 text-sm hover:bg-accent/5">
                    <Checkbox checked={!!checked[it.id]} onCheckedChange={(v) => setChecked((p) => ({ ...p, [it.id]: !!v }))} />
                    <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{it.label}</span>
                    {it.required && <Badge variant="outline" className="text-[10px]">Required</Badge>}
                  </label>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="usage" className="mt-3">
              <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
                Used 128 times in the last 30 days across 42 branches.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
