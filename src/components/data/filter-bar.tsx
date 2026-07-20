import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FilterBar({
  search, onSearch, placeholder = "Search…", children, onReset,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
  onReset?: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="h-9 pl-8"
        />
      </div>
      {children}
      {onReset && (
        <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs" onClick={onReset}>
          <X className="size-3.5" /> Reset
        </Button>
      )}
    </div>
  );
}
