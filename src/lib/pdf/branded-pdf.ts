// Branded PDF generator for Digivista reports.
// Uses jsPDF for real, selectable text and embeds the Digivista logo on
// every page. No html2canvas — output is a genuine text PDF, not a screenshot.

import { jsPDF } from "jspdf";
import { DIGIVISTA_LOGO_URL } from "@/components/shell/brand-logo";

let cachedLogo: { dataUrl: string; width: number; height: number } | null = null;

async function loadLogo() {
  if (cachedLogo) return cachedLogo;
  const res = await fetch(DIGIVISTA_LOGO_URL);
  const blob = await res.blob();
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  const dims: { width: number; height: number } = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = dataUrl;
  });
  cachedLogo = { dataUrl, width: dims.width, height: dims.height };
  return cachedLogo;
}

export interface ReportField {
  label: string;
  value: string;
}
export interface ReportSection {
  heading: string;
  /** Two-column key/value rows */
  rows?: ReportField[];
  /** Free-form paragraph text */
  paragraph?: string;
  /** Simple table with header + body rows */
  table?: { headers: string[]; body: (string | number)[][] };
  /** Bulleted list */
  bullets?: string[];
}
export interface ReportOptions {
  title: string;
  subtitle?: string;
  referenceId?: string;
  meta?: ReportField[]; // shown in the header band
  sections: ReportSection[];
  footer?: string;
  filename: string;
}

// Brand palette (matches app theme)
const NAVY: [number, number, number] = [15, 23, 42];
const SLATE: [number, number, number] = [71, 85, 105];
const MUTED: [number, number, number] = [148, 163, 184];
const BORDER: [number, number, number] = [226, 232, 240];
const ACCENT: [number, number, number] = [29, 78, 216];
const HEADER_BG: [number, number, number] = [248, 250, 252];

export async function generateBrandedPDF(opts: ReportOptions) {
  const logo = await loadLogo();
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;

  const logoH = 28;
  const logoW = (logo.width / logo.height) * logoH;

  let y = 0;

  const drawHeader = (pageIndex: number) => {
    // Header band
    pdf.setFillColor(...HEADER_BG);
    pdf.rect(0, 0, pageW, 70, "F");
    pdf.setDrawColor(...BORDER);
    pdf.setLineWidth(0.5);
    pdf.line(0, 70, pageW, 70);

    pdf.addImage(logo.dataUrl, "PNG", margin, 21, logoW, logoH);

    // Right-side meta
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...SLATE);
    pdf.text("DIGIVISTA INFOTECH", pageW - margin, 30, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text("Unlocking Digital Possibilities", pageW - margin, 42, { align: "right" });
    pdf.text(
      `Generated ${new Date().toLocaleString()}`,
      pageW - margin,
      54,
      { align: "right" },
    );

    y = 90;
    if (pageIndex === 0) {
      // Title block
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(...NAVY);
      pdf.text(opts.title, margin, y);
      y += 8;
      if (opts.subtitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...SLATE);
        y += 12;
        const lines = pdf.splitTextToSize(opts.subtitle, contentW);
        pdf.text(lines, margin, y);
        y += lines.length * 12;
      }
      if (opts.referenceId) {
        y += 6;
        pdf.setFillColor(...ACCENT);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        const label = `REF ${opts.referenceId}`;
        const w = pdf.getTextWidth(label) + 14;
        pdf.roundedRect(margin, y, w, 18, 3, 3, "F");
        pdf.text(label, margin + 7, y + 12);
        y += 26;
      } else {
        y += 12;
      }

      if (opts.meta?.length) {
        pdf.setDrawColor(...BORDER);
        pdf.setFillColor(...HEADER_BG);
        const cardH = 46;
        pdf.roundedRect(margin, y, contentW, cardH, 4, 4, "FD");
        const cols = Math.min(opts.meta.length, 4);
        const colW = contentW / cols;
        opts.meta.slice(0, cols * 2).forEach((m, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = margin + col * colW + 12;
          const cy = y + 16 + row * 18;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.setTextColor(...MUTED);
          pdf.text(m.label.toUpperCase(), x, cy);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(...NAVY);
          pdf.text(m.value, x, cy + 12);
        });
        y += cardH + 16;
      }
    }
  };

  const drawFooter = () => {
    const total = pdf.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      pdf.setPage(i);
      pdf.setDrawColor(...BORDER);
      pdf.line(margin, pageH - 34, pageW - margin, pageH - 34);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...MUTED);
      pdf.text(
        opts.footer ?? "© Digivista Infotech · Confidential",
        margin,
        pageH - 20,
      );
      pdf.text(`Page ${i} of ${total}`, pageW - margin, pageH - 20, {
        align: "right",
      });
    }
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 50) {
      pdf.addPage();
      drawHeader(pdf.getNumberOfPages() - 1);
    }
  };

  const drawSectionHeading = (heading: string) => {
    ensureSpace(30);
    pdf.setFillColor(...ACCENT);
    pdf.rect(margin, y, 3, 12, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(...NAVY);
    pdf.text(heading, margin + 10, y + 10);
    y += 20;
  };

  const drawRows = (rows: ReportField[]) => {
    const rowH = 20;
    const labelW = 170;
    rows.forEach((r, i) => {
      ensureSpace(rowH);
      if (i % 2 === 0) {
        pdf.setFillColor(...HEADER_BG);
        pdf.rect(margin, y, contentW, rowH, "F");
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(...SLATE);
      pdf.text(r.label, margin + 8, y + 13);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...NAVY);
      const valueLines = pdf.splitTextToSize(r.value || "—", contentW - labelW - 16);
      pdf.text(valueLines, margin + labelW, y + 13);
      y += Math.max(rowH, valueLines.length * 12 + 8);
    });
    y += 6;
  };

  const drawParagraph = (text: string) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...SLATE);
    const lines = pdf.splitTextToSize(text, contentW);
    lines.forEach((line: string) => {
      ensureSpace(14);
      pdf.text(line, margin, y + 10);
      y += 13;
    });
    y += 8;
  };

  const drawBullets = (items: string[]) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...SLATE);
    items.forEach((item) => {
      const lines = pdf.splitTextToSize(item, contentW - 14);
      ensureSpace(lines.length * 12 + 4);
      pdf.setFillColor(...ACCENT);
      pdf.circle(margin + 4, y + 6, 1.6, "F");
      pdf.text(lines, margin + 14, y + 9);
      y += lines.length * 12 + 4;
    });
    y += 6;
  };

  const drawTable = (headers: string[], body: (string | number)[][]) => {
    const cols = headers.length;
    const colW = contentW / cols;
    const rowH = 18;
    ensureSpace(rowH);
    pdf.setFillColor(...NAVY);
    pdf.rect(margin, y, contentW, rowH, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(255, 255, 255);
    headers.forEach((h, i) => pdf.text(h, margin + i * colW + 8, y + 12));
    y += rowH;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    body.forEach((row, ri) => {
      ensureSpace(rowH);
      if (ri % 2 === 0) {
        pdf.setFillColor(...HEADER_BG);
        pdf.rect(margin, y, contentW, rowH, "F");
      }
      pdf.setTextColor(...NAVY);
      row.forEach((cell, ci) => {
        const cellText = pdf.splitTextToSize(String(cell ?? ""), colW - 16);
        pdf.text(cellText[0] ?? "", margin + ci * colW + 8, y + 12);
      });
      y += rowH;
    });
    pdf.setDrawColor(...BORDER);
    pdf.rect(margin, y - body.length * rowH - rowH, contentW, (body.length + 1) * rowH);
    y += 10;
  };

  drawHeader(0);

  opts.sections.forEach((s) => {
    drawSectionHeading(s.heading);
    if (s.paragraph) drawParagraph(s.paragraph);
    if (s.rows?.length) drawRows(s.rows);
    if (s.bullets?.length) drawBullets(s.bullets);
    if (s.table) drawTable(s.table.headers, s.table.body);
  });

  drawFooter();

  pdf.save(opts.filename);
}
