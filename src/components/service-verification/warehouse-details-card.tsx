import { motion } from "framer-motion";
import { Building2, Camera, HardDrive, MapPin, Phone, User } from "lucide-react";
import type { Warehouse } from "@/lib/service-verification/warehouses";
import { Skeleton } from "@/components/ui/skeleton";

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

export function WarehouseDetailsCard({
  warehouse,
  loading,
}: {
  warehouse: Warehouse | null;
  loading: boolean;
}) {
  if (!loading && !warehouse) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-border bg-card"
    >
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Warehouse details</h2>
        <p className="text-xs text-muted-foreground">Auto-populated from records — read only.</p>
      </header>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading || !warehouse ? (
          Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] rounded-md" />
          ))
        ) : (
          <>
            <Field icon={Building2} label="Warehouse" value={warehouse.name} />
            <Field
              icon={Building2}
              label="Warehouse code"
              value={<span className="font-mono">{warehouse.code}</span>}
            />
            <Field icon={MapPin} label="Location" value={warehouse.location} />
            <Field icon={User} label="Contact person" value={warehouse.contact} />
            <Field
              icon={Phone}
              label="Phone"
              value={<span className="font-mono">{warehouse.phone}</span>}
            />
            <Field
              icon={Camera}
              label="Cameras"
              value={<span className="font-mono">{warehouse.cameras}</span>}
            />
            <Field
              icon={HardDrive}
              label="NVRs"
              value={<span className="font-mono">{warehouse.nvrs}</span>}
            />
          </>
        )}
      </div>
    </motion.section>
  );
}
