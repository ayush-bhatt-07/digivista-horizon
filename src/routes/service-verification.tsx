import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, Send, ThumbsUp } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { ChecklistSection } from "@/components/service-verification/checklist-section";
import { EngineerReview } from "@/components/service-verification/engineer-review";
import { RatingStars } from "@/components/service-verification/rating-stars";
import { SubmitDialog } from "@/components/service-verification/submit-dialog";
import { UploadSection } from "@/components/service-verification/upload-section";
import { WarehouseDetailsCard } from "@/components/service-verification/warehouse-details-card";
import { WarehouseLookup } from "@/components/service-verification/warehouse-lookup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  fetchWarehouse,
  type ChecklistAnswers,
  type EngineerRatings,
  type Warehouse,
} from "@/lib/service-verification/warehouses";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/service-verification")({
  head: () => ({
    meta: [
      { title: "Service Verification — Digivista Console" },
      {
        name: "description",
        content:
          "Verify completed field service visits, capture checklist compliance, engineer ratings, and customer feedback.",
      },
    ],
  }),
  component: ServiceVerificationPage,
});

const EMPTY_CHECKLIST: ChecklistAnswers = {
  onTime: null,
  companyId: null,
  safety: null,
  resolved: null,
  cleaned: null,
  successful: null,
};

const EMPTY_RATINGS: EngineerRatings = {
  professionalism: 0,
  technicalKnowledge: 0,
  communication: 0,
  behaviour: 0,
  punctuality: 0,
};

function generateReferenceId() {
  const n = Math.floor(Math.random() * 900 + 100);
  return `SV-${new Date().getFullYear()}-${String(n).padStart(3, "0")}`;
}

function ServiceVerificationPage() {
  // Step 1
  const [warehouseName, setWarehouseName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [fetching, setFetching] = useState(false);

  // Sections
  const [checklist, setChecklist] = useState<ChecklistAnswers>(EMPTY_CHECKLIST);
  const [ratings, setRatings] = useState<EngineerRatings>(EMPTY_RATINGS);
  const [overallRating, setOverallRating] = useState(0);
  const [recommend, setRecommend] = useState<"yes" | "no" | null>(null);
  const [likelihood, setLikelihood] = useState<number[]>([8]);
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [declaration, setDeclaration] = useState(false);
  const [signature, setSignature] = useState("");
  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    []
  );

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  async function handleFetch() {
    if (!warehouseName) return;
    setFetching(true);
    setWarehouse(null);
    try {
      const w = await fetchWarehouse(warehouseName);
      if (!w) {
        toast.error("Warehouse not found");
        return;
      }
      setWarehouse(w);
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit() {
    if (!warehouse) return toast.error("Please fetch warehouse details first");
    const missingChecklist = Object.values(checklist).some((v) => v === null);
    if (missingChecklist) return toast.error("Complete every checklist question");
    if (Object.values(ratings).some((v) => v === 0))
      return toast.error("Rate every engineer dimension");
    if (overallRating === 0) return toast.error("Provide an overall rating");
    if (!recommend) return toast.error("Select whether you would recommend Digivista");
    if (!declaration) return toast.error("Please confirm the declaration");
    if (!signature.trim()) return toast.error("Digital signature is required");

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const id = generateReferenceId();
    setReferenceId(id);
    setSubmitting(false);
    setSuccessOpen(true);
  }

  const showRest = !!warehouse;

  return (
    <>
      <PageHeader
        title="Service Verification"
        description="Verify completed field service visits and submit customer feedback."
      />

      <div className="space-y-6">
        <WarehouseLookup
          warehouseName={warehouseName}
          onWarehouseName={setWarehouseName}
          managerName={managerName}
          onManagerName={setManagerName}
          onFetch={handleFetch}
          loading={fetching}
        />

        {(fetching || warehouse) && (
          <WarehouseDetailsCard warehouse={warehouse} loading={fetching} />
        )}

        <motion.div
          initial={false}
          animate={{ opacity: showRest ? 1 : 0.4, pointerEvents: showRest ? "auto" : "none" }}
          className="space-y-6"
        >
          <ChecklistSection
            value={checklist}
            onChange={(p) => setChecklist((c) => ({ ...c, ...p }))}
          />

          <EngineerReview
            value={ratings}
            onChange={(p) => setRatings((r) => ({ ...r, ...p }))}
          />

          {/* Overall experience */}
          <section className="rounded-lg border border-border bg-card">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Overall experience</h2>
              <p className="text-xs text-muted-foreground">
                Summarize your satisfaction with the service.
              </p>
            </header>
            <div className="grid gap-6 p-4 lg:grid-cols-2">
              <div>
                <Label className="mb-2 block">Overall service rating</Label>
                <RatingStars
                  size="lg"
                  value={overallRating}
                  onChange={setOverallRating}
                  label="Overall service rating"
                />
              </div>

              <div>
                <Label className="mb-2 block">Would you recommend Digivista?</Label>
                <RadioGroup
                  value={recommend ?? ""}
                  onValueChange={(v) => setRecommend(v as "yes" | "no")}
                  className="flex gap-2"
                >
                  {[
                    { v: "yes", label: "Yes" },
                    { v: "no", label: "No" },
                  ].map((o) => {
                    const active = recommend === o.v;
                    return (
                      <Label
                        key={o.v}
                        htmlFor={`rec-${o.v}`}
                        className={cn(
                          "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors",
                          active
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background hover:bg-secondary"
                        )}
                      >
                        <RadioGroupItem id={`rec-${o.v}`} value={o.v} className="size-3.5" />
                        {o.label}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <Label>Likelihood to use services again</Label>
                  <span className="font-mono text-sm text-muted-foreground">
                    {likelihood[0]} / 10
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={likelihood}
                  onValueChange={setLikelihood}
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                  <span>Not likely</span>
                  <span>Extremely likely</span>
                </div>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="rounded-lg border border-border bg-card">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Comments</h2>
            </header>
            <div className="p-4">
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please share your overall experience, suggestions or complaints…"
                rows={5}
                className="resize-y"
              />
            </div>
          </section>

          <UploadSection files={files} onChange={setFiles} />

          {/* Declaration */}
          <section className="rounded-lg border border-border bg-card">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Declaration</h2>
            </header>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="md:col-span-2 flex items-start gap-2">
                <Checkbox
                  id="decl"
                  checked={declaration}
                  onCheckedChange={(v) => setDeclaration(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="decl" className="cursor-pointer text-sm font-normal leading-snug">
                  I confirm that the above information is accurate to the best of my
                  knowledge.
                </Label>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sig">Digital signature</Label>
                <Input
                  id="sig"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full name"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" value={today} readOnly className="h-10 font-mono text-sm" />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-12 min-w-64 gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Submit verification
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {!showRest && (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
            <ThumbsUp className="size-4" />
            Fetch warehouse details to continue with the verification form.
          </div>
        )}
      </div>

      <SubmitDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        referenceId={referenceId}
      />
    </>
  );
}
