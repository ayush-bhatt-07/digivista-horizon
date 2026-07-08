import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExportToolbar() {
  const noop = (label: string) => () => toast.success(`${label} queued`, { description: "Your export will download shortly." });
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={noop("PDF export")}><FileText className="size-3.5" /> Export PDF</Button>
      <Button size="sm" variant="outline" onClick={noop("Excel export")}><FileSpreadsheet className="size-3.5" /> Export Excel</Button>
      <Button size="sm" variant="outline" onClick={noop("Monthly report")}><Download className="size-3.5" /> Monthly Report</Button>
      <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="size-3.5" /> Print</Button>
    </div>
  );
}
