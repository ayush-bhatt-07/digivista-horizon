import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm", className)}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
