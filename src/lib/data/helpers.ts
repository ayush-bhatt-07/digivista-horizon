export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });

export const fmtRelative = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const healthTone = (n: number) =>
  n >= 85 ? "text-success" : n >= 65 ? "text-warning" : "text-destructive";

export const priorityTone: Record<string, string> = {
  low: "bg-muted text-muted-foreground ring-border",
  medium: "bg-info/15 text-info-foreground ring-info/30",
  high: "bg-warning/20 text-warning-foreground ring-warning/40",
  critical: "bg-destructive/15 text-destructive ring-destructive/30",
};

export const severityTone = priorityTone;
