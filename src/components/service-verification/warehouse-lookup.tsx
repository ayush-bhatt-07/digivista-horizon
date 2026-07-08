import { Search, Warehouse as WarehouseIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { WAREHOUSE_NAMES } from "@/lib/service-verification/warehouses";

export function WarehouseLookup({
  warehouseName,
  onWarehouseName,
  managerName,
  onManagerName,
  onFetch,
  loading,
}: {
  warehouseName: string;
  onWarehouseName: (v: string) => void;
  managerName: string;
  onManagerName: (v: string) => void;
  onFetch: () => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = WAREHOUSE_NAMES.filter((n) =>
    n.toLowerCase().includes(query.toLowerCase())
  );

  const canFetch = warehouseName.trim() && managerName.trim() && !loading;

  return (
    <div className="rounded-lg border border-border bg-card">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
          <WarehouseIcon className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Step 1 — Warehouse lookup</h2>
          <p className="text-xs text-muted-foreground">
            Select a warehouse and identify yourself to load service context.
          </p>
        </div>
      </header>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="warehouse">Warehouse name</Label>
          <Select value={warehouseName} onValueChange={onWarehouseName}>
            <SelectTrigger id="warehouse" className="h-10">
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Search…"
                    className="h-8 pl-7 text-xs"
                  />
                </div>
              </div>
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">No results</div>
              )}
              {filtered.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="manager">Branch manager name</Label>
          <Input
            id="manager"
            value={managerName}
            onChange={(e) => onManagerName(e.target.value)}
            placeholder="Enter your name"
            className="h-10"
          />
        </div>

        <div className="sm:col-span-2">
          <Button onClick={onFetch} disabled={!canFetch} className="h-10 gap-2">
            {loading ? "Fetching…" : "Fetch details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
