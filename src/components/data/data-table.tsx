import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Inbox } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

interface Props<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  selection?: {
    selected: string[];
    onChange: (ids: string[]) => void;
    bulkActions?: (ids: string[]) => ReactNode;
  };
  emptyTitle?: string;
  emptyHint?: string;
}

export function DataTable<T extends { id: string }>({
  columns, data, loading, pageSize = 10, onRowClick, selection, emptyTitle = "No records", emptyHint = "Try adjusting your filters.",
}: Props<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return data;
    const s = [...data].sort((a, b) => {
      const va = col.sortValue!(a); const vb = col.sortValue!(b);
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return s;
  }, [data, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allSelected = selection && paged.length > 0 && paged.every((r) => selection.selected.includes(r.id));
  const someSelected = selection && !allSelected && paged.some((r) => selection.selected.includes(r.id));

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  return (
    <div className="rounded-lg border border-border bg-card">
      {selection && selection.selected.length > 0 && (
        <div className="flex items-center justify-between border-b border-border bg-accent/5 px-4 py-2">
          <div className="text-xs font-medium text-foreground">
            {selection.selected.length} selected
          </div>
          <div className="flex items-center gap-2">
            {selection.bulkActions?.(selection.selected)}
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => selection.onChange([])}>
              Clear
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {selection && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(v) => {
                      const ids = paged.map((r) => r.id);
                      if (v) selection.onChange(Array.from(new Set([...selection.selected, ...ids])));
                      else selection.onChange(selection.selected.filter((id) => !ids.includes(id)));
                    }}
                  />
                </TableHead>
              )}
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn("h-9 text-[11px] font-medium uppercase tracking-wide text-muted-foreground", c.className, c.sortable && "cursor-pointer select-none")}
                  onClick={() => c.sortable && toggleSort(c.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortable && (
                      sort?.key === c.key
                        ? (sort.dir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)
                        : <ChevronsUpDown className="size-3 opacity-40" />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`s-${i}`}>
                  {selection && <TableCell><Skeleton className="size-4" /></TableCell>}
                  {columns.map((c) => (
                    <TableCell key={c.key}><Skeleton className="h-4 w-full max-w-32" /></TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (selection ? 1 : 0)} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="size-6" />
                    <div className="text-sm font-medium text-foreground">{emptyTitle}</div>
                    <div className="text-xs">{emptyHint}</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              paged.map((row) => {
                const isSelected = selection?.selected.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("[data-stop-row]")) return;
                      onRowClick?.(row);
                    }}
                  >
                    {selection && (
                      <TableCell data-stop-row>
                        <Checkbox
                          checked={!!isSelected}
                          onCheckedChange={(v) => {
                            selection.onChange(
                              v ? [...selection.selected, row.id] : selection.selected.filter((id) => id !== row.id)
                            );
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((c) => (
                      <TableCell key={c.key} className={c.className}>{c.cell(row)}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      {sorted.length > pageSize && (
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div>
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7" disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <span className="px-2 font-mono">{safePage} / {totalPages}</span>
            <Button variant="outline" size="sm" className="h-7" disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
