import { FileText, Image as ImageIcon, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT = ".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx";

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return ImageIcon;
  return FileText;
}

export function UploadSection({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const add = (list: FileList | null) => {
    if (!list) return;
    onChange([...files, ...Array.from(list)]);
  };

  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Proof of work</h2>
        <p className="text-xs text-muted-foreground">Attach photos, PDFs, or Word documents.</p>
      </header>

      <div className="p-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            add(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-background/40 hover:border-primary/50 hover:bg-secondary/40"
          )}
        >
          <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Upload className="size-5" />
          </div>
          <div className="mt-3 text-sm font-medium text-foreground">
            Drop files here or click to browse
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, PDF, DOC · up to 10 MB each
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => add(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f, i) => {
              const Icon = fileIcon(f.name);
              return (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2"
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{f.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {fmtSize(f.size)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                    aria-label={`Remove ${f.name}`}
                  >
                    <X className="size-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
