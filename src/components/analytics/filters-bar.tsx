import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AnalyticsFilters {
  dateRange: string;
  warehouse: string;
  engineer: string;
  rating: string;
  serviceType: string;
  status: string;
}

export const DEFAULT_FILTERS: AnalyticsFilters = {
  dateRange: "30d",
  warehouse: "all",
  engineer: "all",
  rating: "all",
  serviceType: "all",
  status: "all",
};

export function FiltersBar({
  value,
  onChange,
  onApply,
  onReset,
}: {
  value: AnalyticsFilters;
  onChange: (v: AnalyticsFilters) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const set = <K extends keyof AnalyticsFilters>(k: K, v: AnalyticsFilters[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Filter className="size-3.5" /> Filters
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
        <Select value={value.dateRange} onValueChange={(v) => set("dateRange", v)}>
          <SelectTrigger><SelectValue placeholder="Date range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last quarter</SelectItem>
            <SelectItem value="365d">Last year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={value.warehouse} onValueChange={(v) => set("warehouse", v)}>
          <SelectTrigger><SelectValue placeholder="Warehouse" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All warehouses</SelectItem>
            <SelectItem value="chd">Chandigarh</SelectItem>
            <SelectItem value="lko">Lucknow</SelectItem>
            <SelectItem value="krn">Karnal</SelectItem>
            <SelectItem value="jmu">Jammu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={value.engineer} onValueChange={(v) => set("engineer", v)}>
          <SelectTrigger><SelectValue placeholder="Engineer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All engineers</SelectItem>
            <SelectItem value="rahul">Rahul</SelectItem>
            <SelectItem value="mohit">Mohit</SelectItem>
            <SelectItem value="suresh">Suresh</SelectItem>
          </SelectContent>
        </Select>
        <Select value={value.rating} onValueChange={(v) => set("rating", v)}>
          <SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any rating</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
          </SelectContent>
        </Select>
        <Select value={value.serviceType} onValueChange={(v) => set("serviceType", v)}>
          <SelectTrigger><SelectValue placeholder="Service type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            <SelectItem value="preventive">Preventive</SelectItem>
            <SelectItem value="corrective">Corrective</SelectItem>
            <SelectItem value="install">Installation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={value.status} onValueChange={(v) => set("status", v)}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="follow_up">Needs Follow-up</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <div className="col-span-2 flex gap-2 md:col-span-4 xl:col-span-1">
          <Button size="sm" className="flex-1" onClick={onApply}>Apply</Button>
          <Button size="sm" variant="outline" onClick={onReset}><RotateCcw className="size-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}
