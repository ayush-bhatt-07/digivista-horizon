import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { NAV_ITEMS } from "@/lib/nav";
import { useRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/shell/status-chip";
import { BrandLogo } from "@/components/shell/brand-logo";

const GROUP_ORDER = ["Operate", "Manage", "Insights", "System"] as const;

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { modules, profile } = useRole();
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const visible = useMemo(
    () =>
      NAV_ITEMS.filter((i) => modules.includes(i.key)).filter((i) =>
        query ? i.label.toLowerCase().includes(query.toLowerCase()) : true
      ),
    [modules, query]
  );

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: visible.filter((i) => i.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <aside
      className={cn(
        "flex h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-[248px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="size-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">Digivista</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">Infotech Console</div>
          </div>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="size-7 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronsLeft
            className={cn("size-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Jump to…"
              className="h-8 border-sidebar-border bg-sidebar-accent/40 pl-8 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus-visible:ring-sidebar-ring"
            />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {grouped.map(({ group, items }) => (
          <div key={group} className="mb-4">
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {group}
              </div>
            )}
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <li key={item.key}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-white"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-white"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Operator card */}
      <div className="border-t border-sidebar-border p-2">
        <div
          className={cn(
            "rounded-md bg-sidebar-accent/60 p-2.5",
            collapsed && "flex justify-center"
          )}
        >
          {collapsed ? (
            <div className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {profile.initials}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                  {profile.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-white">{profile.name}</div>
                  <div className="truncate text-[11px] text-sidebar-foreground/60">
                    {profile.label}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 space-y-1 border-t border-sidebar-border pt-2 text-[11px] text-sidebar-foreground/70">
                <div className="flex justify-between gap-2">
                  <span className="text-sidebar-foreground/50">Company</span>
                  <span className="truncate text-right text-white/90">{profile.company}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-sidebar-foreground/50">Branch</span>
                  <span className="truncate text-right text-white/90">{profile.branch}</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <span className="text-sidebar-foreground/50">SLA</span>
                  <StatusChip status={profile.slaStatus} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
