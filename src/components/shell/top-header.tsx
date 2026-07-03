import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Moon, Plus, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_PROFILES, useRole, type Role } from "@/lib/roles";
import { NAV_ITEMS } from "@/lib/nav";

export function TopHeader({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { role, setRole, profile } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const current = NAV_ITEMS.find(
    (i) => (i.to === "/" ? pathname === "/" : pathname.startsWith(i.to))
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground">Console</Link>
        {current && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <span className="truncate font-medium text-foreground">{current.label}</span>
          </>
        )}
      </nav>

      {/* Command search */}
      <button
        onClick={onOpenPalette}
        className="ml-4 hidden h-9 w-full max-w-md items-center gap-2 rounded-md border border-input bg-secondary/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary md:flex"
      >
        <Search className="size-4" />
        <span>Search or jump to…</span>
        <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">New ticket</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="relative size-8"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          aria-label="Toggle theme"
          onClick={() => setDark((v) => !v)}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {/* Role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 font-normal">
              <span className="grid size-5 place-items-center rounded bg-primary text-[10px] font-semibold text-primary-foreground">
                {profile.initials}
              </span>
              <span className="hidden text-xs md:inline">{profile.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              View as role
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={role}
              onValueChange={(v) => setRole(v as Role)}
            >
              {(Object.keys(ROLE_PROFILES) as Role[]).map((r) => (
                <DropdownMenuRadioItem key={r} value={r} className="text-sm">
                  {ROLE_PROFILES[r].label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm">Profile settings</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
