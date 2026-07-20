import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole, ROLE_PROFILES, type Role } from "@/lib/roles";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Digivista Console" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { role, setRole } = useRole();
  const [name, setName] = useState("Digivista Infotech");
  const [gst, setGst] = useState("27AABCD1234E1Z5");
  const [density, setDensity] = useState("comfortable");
  const [notif, setNotif] = useState({ ticket: true, sla: true, verification: true, digest: false });

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Workspace, roles, integrations and preferences."
        actions={<Button size="sm" onClick={() => toast.success("Settings saved")}><Save className="size-3.5" /> Save</Button>}
      />

      <Tabs defaultValue="workspace">
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="roles">Roles & access</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-4">
          <div className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="grid gap-2"><Label>Organization name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="grid gap-2"><Label>GST / Tax ID</Label><Input value={gst} onChange={(e) => setGst(e.target.value)} className="font-mono" /></div>
            <div className="grid gap-2"><Label>Default timezone</Label>
              <Select defaultValue="ist"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ist">Asia/Kolkata (IST)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <div className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="grid gap-2">
              <Label>Preview as role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_PROFILES) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_PROFILES[r].label} — {ROLE_PROFILES[r].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                <SettingsIcon className="mr-1 inline size-3" /> Role changes are session-local for preview. Production wiring uses Supabase RBAC.
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
            {[
              ["ticket", "Ticket updates", "New tickets, comments and status changes"],
              ["sla", "SLA warnings", "Breach and at-risk alerts"],
              ["verification", "Verification submissions", "Customer signatures & ratings"],
              ["digest", "Daily digest email", "Executive summary at 8:00 IST"],
            ].map(([key, label, hint]) => (
              <div key={key} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{hint}</div>
                </div>
                <Switch checked={notif[key as keyof typeof notif]} onCheckedChange={(v) => setNotif((p) => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: "Supabase", status: "Not connected", cta: "Connect" },
              { name: "Slack", status: "Ready", cta: "Configure" },
              { name: "Twilio SMS", status: "Ready", cta: "Configure" },
              { name: "SendGrid", status: "Connected", cta: "Manage" },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <div className="text-sm font-semibold">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.status}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.info(`${i.name} · ${i.cta}`)}>{i.cta}</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <div className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="grid gap-2"><Label>Density</Label>
              <Select value={density} onValueChange={setDensity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="comfortable">Comfortable</SelectItem><SelectItem value="compact">Compact</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground">Theme toggle lives in the top bar.</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
