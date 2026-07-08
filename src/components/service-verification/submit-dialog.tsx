import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function SubmitDialog({
  open,
  onOpenChange,
  referenceId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  referenceId: string;
}) {
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

        <div className="mt-4 flex justify-center">
          <Button onClick={() => onOpenChange(false)} className="min-w-32">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
