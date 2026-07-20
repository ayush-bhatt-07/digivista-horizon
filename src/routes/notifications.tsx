import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, TicketCheck, Wrench, Cpu, ClipboardCheck, BarChart3, AlertTriangle, Cog } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/shell/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/lib/data/store";
import { fmtRelative } from "@/lib/data/helpers";
import type { NotificationKind } from "@/lib/data/types";

const ICONS: Record<NotificationKind, typeof Bell> = {
  ticket: TicketCheck, engineer: Wrench, asset: Cpu, verification: ClipboardCheck,
  analytics: BarChart3, sla: AlertTriangle, system: Cog,
};

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Digivista Console" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications } = useData();
  const [tab, setTab] = useState("all");

  const filtered = useMemo(() => {
    if (tab === "unread") return notifications.items.filter((n) => !n.read);
    if (tab === "all") return notifications.items;
    return notifications.items.filter((n) => n.kind === tab);
  }, [notifications.items, tab]);

  const unread = notifications.items.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Everything that needs your attention across accounts, tickets, engineers and analytics."
        actions={
          <Button variant="outline" size="sm" onClick={() => { notifications.items.filter((n) => !n.read).forEach((n) => notifications.update(n.id, { read: true })); toast.success("All marked as read"); }}>
            <Check className="size-3.5" /> Mark all read
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total" value={String(notifications.items.length)} icon={Bell} />
        <StatCard label="Unread" value={String(unread)} hint="Needs attention" />
        <StatCard label="SLA alerts" value={String(notifications.items.filter((n) => n.kind === "sla").length)} />
        <StatCard label="Verifications" value={String(notifications.items.filter((n) => n.kind === "verification").length)} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-3">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread <Badge variant="secondary" className="ml-1 font-mono text-[10px]">{unread}</Badge></TabsTrigger>
          <TabsTrigger value="ticket">Tickets</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
          <TabsTrigger value="verification">Verifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {filtered.slice(0, 40).map((n) => {
          const Icon = ICONS[n.kind];
          return (
            <div key={n.id} className={`flex items-start gap-3 p-3 ${!n.read ? "bg-accent/5" : ""}`}>
              <div className="grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{fmtRelative(n.at)}</div>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{n.body}</div>
              </div>
              {!n.read && (
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => notifications.update(n.id, { read: true })}>Mark read</Button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">You're all caught up.</div>}
      </div>
    </div>
  );
}
