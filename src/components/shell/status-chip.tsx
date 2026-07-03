import { cn } from "@/lib/utils";

type Status =
  | "on_track"
  | "at_risk"
  | "breached"
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

const MAP: Record<Status, { label: string; className: string; dot: string }> = {
  on_track:    { label: "On track",    className: "bg-success/15 text-success-foreground ring-success/30",      dot: "bg-success" },
  at_risk:     { label: "At risk",     className: "bg-warning/20 text-warning-foreground ring-warning/40",      dot: "bg-warning" },
  breached:    { label: "Breached",    className: "bg-destructive/15 text-destructive ring-destructive/30",     dot: "bg-destructive" },
  open:        { label: "Open",        className: "bg-info/15 text-info-foreground ring-info/30",               dot: "bg-info" },
  in_progress: { label: "In progress", className: "bg-accent/15 text-accent-foreground ring-accent/30",         dot: "bg-accent" },
  resolved:    { label: "Resolved",    className: "bg-success/15 text-success-foreground ring-success/30",      dot: "bg-success" },
  closed:      { label: "Closed",      className: "bg-muted text-muted-foreground ring-border",                 dot: "bg-muted-foreground" },
};

export function StatusChip({ status, className }: { status: Status; className?: string }) {
  const cfg = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset",
        cfg.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
