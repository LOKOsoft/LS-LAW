"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormModal } from "@/components/shared/form-modal";

type MatterOption = { id: string; title: string; matterNumber: string };

export function UploadDocumentDialog({ matters, defaultOpen = false }: { matters: MatterOption[]; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [files, setFiles] = React.useState<File[]>([]);
  const [matterId, setMatterId] = React.useState<string>("");
  const [tags, setTags] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  async function handleUpload() {
    if (files.length === 0) {
      toast.error("Choose one or more files to upload");
      return;
    }
    setIsSubmitting(true);
    let succeeded = 0;
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        if (matterId) formData.append("matterId", matterId);
        if (tags) formData.append("tags", tags);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) succeeded++;
      }

      if (succeeded === files.length) {
        toast.success(
          files.length === 1 ? "Document uploaded" : `${succeeded} documents uploaded`,
          { description: files.length === 1 ? `${files[0].name} saved to the document vault.` : "All files saved to the document vault." },
        );
      } else {
        toast.error(`${succeeded} of ${files.length} files uploaded — some failed.`);
      }
      setOpen(false);
      setFiles([]);
      setTags("");
      router.refresh();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormModal
      trigger={
        <Button className="gap-1.5">
          <UploadCloud className="size-4" />
          Upload
        </Button>
      }
      title="Upload document"
      description="Files are saved locally to the firm's document vault (/storage)."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isSubmitting}>
            {isSubmitting
              ? "Uploading..."
              : files.length > 1
                ? `Upload ${files.length} documents`
                : "Upload document"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="upload-file">Files</Label>
          <Input
            id="upload-file"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          />
          {files.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              {files.length} file{files.length > 1 ? "s" : ""} selected: {files.map((f) => f.name).join(", ")}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Select one or more files to upload together.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="upload-matter">Matter (optional)</Label>
          <Select value={matterId} onValueChange={setMatterId}>
            <SelectTrigger id="upload-matter" className="w-full">
              <SelectValue placeholder="Unfiled" />
            </SelectTrigger>
            <SelectContent>
              {matters.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.title} ({m.matterNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="upload-tags">Tags</Label>
          <Input id="upload-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. Contract, Draft" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5">
          <Checkbox id="ocr" disabled />
          <Label htmlFor="ocr" className="text-sm font-normal text-muted-foreground">
            Run OCR text extraction (coming soon)
          </Label>
        </div>
      </div>
    </FormModal>
  );
}
