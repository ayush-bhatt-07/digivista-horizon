import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAnalyticsData } from "@/lib/analytics/data";
import { generateBrandedPDF } from "@/lib/pdf/branded-pdf";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function todayStamp() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCSV(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

function buildWorkbookCSV() {
  const d = getAnalyticsData();
  const sections: string[] = [];

  sections.push("Service Analytics Report");
  sections.push(`Generated,${new Date().toISOString()}`);
  sections.push("");

  sections.push("SUMMARY");
  sections.push(toCSV([
    ["Total Reviews", "Branches Covered", "Average Rating", "Last Updated"],
    [d.summary.totalReviews, d.summary.branchesCovered, d.summary.averageRating, d.summary.lastUpdated],
  ]));
  sections.push("");

  sections.push("KPIs");
  sections.push(toCSV([["Label", "Value", "Delta", "Trend", "Hint"], ...d.kpis.map((k) => [k.label, k.value, k.delta ?? "", k.trend ?? "", k.hint ?? ""])]));
  sections.push("");

  sections.push("MONTHLY TREND");
  sections.push(toCSV([["Month", "Rating", "Volume"], ...d.trend.map((t) => [t.month, t.rating, t.volume])]));
  sections.push("");

  sections.push("BRANCH PERFORMANCE");
  sections.push(toCSV([["Branch", "Rating", "Reviews"], ...d.branches.map((b) => [b.branch, b.rating, b.reviews])]));
  sections.push("");

  sections.push("ENGINEER LEADERBOARD");
  sections.push(toCSV([["Name", "Rating", "Reviews", "Compliance %", "Badge"], ...d.engineers.map((e) => [e.name, e.rating, e.reviews, e.compliance, e.badge ?? ""])]));
  sections.push("");

  sections.push("PROTOCOL COMPLIANCE");
  sections.push(toCSV([["Label", "Value"], ...d.protocol.map((p) => [p.label, p.value])]));
  sections.push("");

  sections.push("WAREHOUSE HEALTH");
  sections.push(toCSV([["ID", "Name", "Region", "Rating", "Reviews", "Health"], ...d.warehouses.map((w) => [w.id, w.name, w.region, w.rating, w.reviews, w.health])]));
  sections.push("");

  sections.push("RECENT REVIEWS");
  sections.push(toCSV([
    ["ID", "Date", "Warehouse", "Manager", "Engineer", "Rating", "Status", "Review", "Manager Comment", "Submitted At"],
    ...d.reviews.map((r) => [r.id, r.date, r.warehouse, r.manager, r.engineer, r.rating, r.status, r.review, r.managerComment, r.submittedAt]),
  ]));
  sections.push("");

  sections.push("INSIGHTS");
  sections.push(toCSV(d.insights.map((i) => [i])));

  return sections.join("\n");
}


export function ExportToolbar() {
  const exportExcel = () => {
    const csv = buildWorkbookCSV();
    // Excel opens .csv natively; BOM ensures UTF-8 chars render correctly.
    triggerDownload(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }), `service-analytics-${todayStamp()}.csv`);
    toast.success("Excel report downloaded");
  };

  const buildPDFOptions = (title: string, filename: string) => {
    const d = getAnalyticsData();
    return {
      filename,
      title,
      subtitle: "Executive summary of service verification performance across all Digivista branches.",
      meta: [
        { label: "Total Reviews", value: String(d.summary.totalReviews) },
        { label: "Branches", value: String(d.summary.branchesCovered) },
        { label: "Avg Rating", value: `${d.summary.averageRating} ★` },
        { label: "Last Updated", value: d.summary.lastUpdated },
      ],
      sections: [
        {
          heading: "Executive KPIs",
          table: {
            headers: ["Metric", "Value", "Delta", "Note"],
            body: d.kpis.map((k) => [k.label, k.value, k.delta ?? "—", k.hint ?? ""]),
          },
        },
        {
          heading: "Monthly Trend",
          table: {
            headers: ["Month", "Rating", "Volume"],
            body: d.trend.map((t) => [t.month, t.rating, t.volume]),
          },
        },
        {
          heading: "Branch Performance",
          table: {
            headers: ["Branch", "Rating", "Reviews"],
            body: d.branches.map((b) => [b.branch, b.rating, b.reviews]),
          },
        },
        {
          heading: "Engineer Leaderboard",
          table: {
            headers: ["Engineer", "Rating", "Reviews", "Compliance %"],
            body: d.engineers.map((e) => [e.name, e.rating, e.reviews, e.compliance]),
          },
        },
        {
          heading: "Warehouse Health",
          table: {
            headers: ["Warehouse", "Region", "Rating", "Health"],
            body: d.warehouses.map((w) => [w.name, w.region, w.rating, w.health]),
          },
        },
        {
          heading: "Recent Reviews",
          table: {
            headers: ["Date", "Warehouse", "Engineer", "Rating", "Status"],
            body: d.reviews.slice(0, 15).map((r) => [r.date, r.warehouse, r.engineer, r.rating, r.status]),
          },
        },
        { heading: "AI Insights", bullets: d.insights },
      ],
    };
  };

  const exportPDF = async () => {
    try {
      await generateBrandedPDF(buildPDFOptions("Service Analytics Report", `service-analytics-${todayStamp()}.pdf`));
      toast.success("PDF report downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Could not generate PDF");
    }
  };

  const exportMonthly = async () => {
    try {
      await generateBrandedPDF(buildPDFOptions("Monthly Performance Report", `monthly-report-${todayStamp()}.pdf`));
      toast.success("Monthly report downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Could not generate PDF");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={exportPDF}><FileText className="size-3.5" /> Export PDF</Button>
      <Button size="sm" variant="outline" onClick={exportExcel}><FileSpreadsheet className="size-3.5" /> Export Excel</Button>
      <Button size="sm" variant="outline" onClick={exportMonthly}><Download className="size-3.5" /> Monthly Report</Button>
      <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="size-3.5" /> Print</Button>
    </div>
  );
}
