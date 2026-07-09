import { CheckCircle2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { generateBrandedPDF } from "@/lib/pdf/branded-pdf";
import type { VerificationSubmission } from "@/lib/service-verification/warehouses";
import { toast } from "sonner";

function formatAnswer(v: string | null) {
  if (!v) return "—";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function SubmitDialog({
  open,
  onOpenChange,
  referenceId,
  submission,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  referenceId: string;
  submission?: VerificationSubmission | null;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!submission) return;
    setDownloading(true);
    try {
      const { warehouse, checklist, engineer } = submission;
      await generateBrandedPDF({
        filename: `service-verification-${referenceId}.pdf`,
        title: "Service Verification Report",
        subtitle: `Post-visit customer verification for ${warehouse.name} warehouse. Completed by ${submission.managerName || submission.signature}.`,
        referenceId,
        meta: [
          { label: "Warehouse", value: warehouse.name },
          { label: "Warehouse Code", value: warehouse.code },
          { label: "Date", value: submission.date },
          { label: "Overall Rating", value: `${submission.overallRating} / 5 ★` },
        ],
        sections: [
          {
            heading: "Warehouse Details",
            rows: [
              { label: "Location", value: warehouse.location },
              { label: "Site Contact", value: warehouse.contact },
              { label: "Phone", value: warehouse.phone },
              { label: "Cameras Installed", value: String(warehouse.cameras) },
              { label: "NVR Units", value: String(warehouse.nvrs) },
            ],
          },
          {
            heading: "Service Checklist",
            rows: [
              { label: "Engineer arrived on time", value: formatAnswer(checklist.onTime) },
              { label: "Carried company ID", value: formatAnswer(checklist.companyId) },
              { label: "Followed safety protocols", value: formatAnswer(checklist.safety) },
              { label: "Issue resolved", value: formatAnswer(checklist.resolved) },
              { label: "Site cleaned after work", value: formatAnswer(checklist.cleaned) },
              { label: "Visit successful", value: formatAnswer(checklist.successful) },
            ],
          },
          {
            heading: "Engineer Ratings",
            table: {
              headers: ["Dimension", "Rating (of 5)"],
              body: [
                ["Professionalism", `${engineer.professionalism} ★`],
                ["Technical knowledge", `${engineer.technicalKnowledge} ★`],
                ["Communication", `${engineer.communication} ★`],
                ["Behaviour", `${engineer.behaviour} ★`],
                ["Punctuality", `${engineer.punctuality} ★`],
              ],
            },
          },
          {
            heading: "Overall Experience",
            rows: [
              { label: "Overall service rating", value: `${submission.overallRating} / 5 ★` },
              { label: "Would recommend Digivista", value: formatAnswer(submission.recommend) },
              { label: "Likelihood to reuse (0–10)", value: String(submission.likelihood) },
            ],
          },
          ...(submission.comments
            ? [{ heading: "Manager Comments", paragraph: submission.comments }]
            : []),
          ...(submission.files.length
            ? [{
                heading: "Proof of Work Attachments",
                bullets: submission.files.map((f) => `${f.name} · ${(f.size / 1024).toFixed(1)} KB`),
              }]
            : []),
          {
            heading: "Declaration",
            rows: [
              { label: "Declaration", value: submission.declaration ? "Confirmed accurate" : "Not confirmed" },
              { label: "Digital signature", value: submission.signature },
              { label: "Signed on", value: submission.date },
            ],
          },
        ],
      });
      toast.success("PDF report downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Could not generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success"
          >
            <CheckCircle2 className="size-8" />
          </motion.div>
          <DialogTitle className="mt-3 text-xl">
            Verification submitted successfully
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for helping us improve our services.
          </p>
        </DialogHeader>

        <div className="mt-2 rounded-md border border-border bg-secondary/40 p-4 text-center">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Reference ID
          </div>
          <div className="mt-1 font-mono text-lg font-semibold text-foreground">
            {referenceId}
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-32">
            Done
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!submission || downloading}
            className="min-w-40 gap-2"
          >
            <Download className="size-4" />
            {downloading ? "Preparing…" : "Download PDF"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
