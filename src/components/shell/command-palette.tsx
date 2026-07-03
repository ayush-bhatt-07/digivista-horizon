import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { NAV_ITEMS } from "@/lib/nav";
import { useRole, ROLE_PROFILES, type Role } from "@/lib/roles";
import { Plus, ArrowRight } from "lucide-react";

export function CommandPalette({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { modules, setRole } = useRole();
  const navigate = useNavigate();
  const items = NAV_ITEMS.filter((i) => modules.includes(i.key));

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, tickets, engineers…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {items.map((i) => (
            <CommandItem key={i.key} onSelect={() => go(i.to)}>
              <i.icon className="mr-2 size-4 text-muted-foreground" />
              <span>{i.label}</span>
              <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/tickets")}>
            <Plus className="mr-2 size-4 text-muted-foreground" />
            New ticket
          </CommandItem>
          <CommandItem onSelect={() => go("/assets")}>
            <Plus className="mr-2 size-4 text-muted-foreground" />
            Register asset
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Switch role">
          {(Object.keys(ROLE_PROFILES) as Role[]).map((r) => (
            <CommandItem
              key={r}
              onSelect={() => {
                setRole(r);
                onOpenChange(false);
              }}
            >
              <span className="mr-2 grid size-5 place-items-center rounded bg-muted text-[10px] font-semibold">
                {ROLE_PROFILES[r].initials}
              </span>
              {ROLE_PROFILES[r].label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
