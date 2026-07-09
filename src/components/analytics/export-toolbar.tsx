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

function buildReportHTML() {
  const d = getAnalyticsData();
  const style = `
    <style>
      * { box-sizing: border-box; }
      body { font-family: Inter, -apple-system, Segoe UI, sans-serif; color: #0f172a; margin: 40px; }
      h1 { font-size: 24px; margin: 0 0 4px; }
      h2 { font-size: 15px; margin: 24px 0 8px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
      .sub { color: #64748b; font-size: 12px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
      th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
      th { background: #f1f5f9; font-weight: 600; }
      .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .kpi { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
      .kpi .l { font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: .04em; }
      .kpi .v { font-size: 18px; font-weight: 700; margin-top: 2px; }
      .kpi .d { font-size: 11px; color: #64748b; }
      ul { margin: 0; padding-left: 18px; font-size: 12px; }
      @media print { body { margin: 20px; } }
    </style>`;

  const kpiCards = d.kpis
    .map((k) => `<div class="kpi"><div class="l">${k.label}</div><div class="v">${k.value}</div><div class="d">${k.delta ?? ""} ${k.hint ?? ""}</div></div>`)
    .join("");

  const table = (headers: string[], rows: (string | number)[][]) =>
    `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;

  return `<!doctype html><html><head><meta charset="utf-8"/><title>Service Analytics Report — ${todayStamp()}</title>${style}</head><body>
    <h1>Digivista — Service Analytics Report</h1>
    <div class="sub">Generated ${new Date().toLocaleString()} · ${d.summary.totalReviews} reviews · ${d.summary.branchesCovered} branches · avg ${d.summary.averageRating}★</div>

    <h2>Executive KPIs</h2>
    <div class="kpi-grid">${kpiCards}</div>

    <h2>Monthly Trend</h2>
    ${table(["Month", "Rating", "Volume"], d.trend.map((t) => [t.month, t.rating, t.volume]))}

    <h2>Branch Performance</h2>
    ${table(["Branch", "Rating", "Reviews"], d.branches.map((b) => [b.branch, b.rating, b.reviews]))}

    <h2>Engineer Leaderboard</h2>
    ${table(["Name", "Rating", "Reviews", "Compliance %", "Badge"], d.engineers.map((e) => [e.name, e.rating, e.reviews, e.compliance, e.badge ?? ""]))}

    <h2>Protocol Compliance</h2>
    ${table(["Label", "Value"], d.protocol.map((p) => [p.label, p.value]))}

    <h2>Warehouse Health</h2>
    ${table(["Warehouse", "Region", "Rating", "Reviews", "Health"], d.warehouses.map((w) => [w.name, w.region, w.rating, w.reviews, w.health]))}

    <h2>Recent Reviews</h2>
    ${table(["Date", "Warehouse", "Engineer", "Rating", "Status", "Manager Comment"], d.reviews.map((r) => [r.date, r.warehouse, r.engineer, r.rating, r.status, r.managerComment]))}

    <h2>AI Insights</h2>
    <ul>${d.insights.map((i) => `<li>${i}</li>`).join("")}</ul>
  </body></html>`;
}

export function ExportToolbar() {
  const exportExcel = () => {
    const csv = buildWorkbookCSV();
    // Excel opens .csv natively; BOM ensures UTF-8 chars render correctly.
    triggerDownload(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }), `service-analytics-${todayStamp()}.csv`);
    toast.success("Excel report downloaded");
  };

  const exportPDF = () => {
    // Open printable HTML in a new tab and auto-trigger the print dialog so
    // the user can "Save as PDF" from the browser — no extra dependency.
    const html = buildReportHTML();
    const w = window.open("", "_blank");
    if (!w) {
      // Popup blocked — fall back to downloading the HTML file directly.
      triggerDownload(new Blob([html], { type: "text/html;charset=utf-8" }), `service-analytics-${todayStamp()}.html`);
      toast.info("Popup blocked — downloaded HTML instead", { description: "Open the file and print to PDF." });
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.addEventListener("load", () => setTimeout(() => w.print(), 300));
    toast.success("PDF report ready", { description: "Choose 'Save as PDF' in the print dialog." });
  };

  const exportMonthly = () => {
    const html = buildReportHTML();
    triggerDownload(new Blob([html], { type: "text/html;charset=utf-8" }), `monthly-report-${todayStamp()}.html`);
    toast.success("Monthly report downloaded");
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
