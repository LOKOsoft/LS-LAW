"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormModal } from "@/components/shared/form-modal";
import { DOCUMENT_TYPE_CATALOG } from "@/features/document-generator/types";
import { DOCUMENT_FIELD_META } from "@/features/document-generator/schemas";
import { createGeneratedDocument } from "@/features/document-generator/actions";
import type { GeneratedDocumentType } from "@/generated/prisma/client";

type Option = { id: string; label: string };

export function GenerateDocumentDialog({ matters, clients }: { matters: Option[]; clients: Option[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [documentType, setDocumentType] = React.useState<GeneratedDocumentType | "">("");
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [matterId, setMatterId] = React.useState<string>("");
  const [clientId, setClientId] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fields = documentType ? DOCUMENT_FIELD_META[documentType] : [];

  function handleTypeChange(next: string) {
    setDocumentType(next as GeneratedDocumentType);
    setValues({});
  }

  async function handleSubmit() {
    if (!documentType) return;
    setIsSubmitting(true);
    try {
      await createGeneratedDocument({
        documentType,
        formData: values,
        matterId: matterId || undefined,
        clientId: clientId || undefined,
      });
      toast.success("Document generated");
      setOpen(false);
      setDocumentType("");
      setValues({});
      setMatterId("");
      setClientId("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate the document.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="gap-1.5">
          <Sparkles className="size-4" />
          Generate document
        </Button>
      }
      title="Generate a document"
      description="Fill in the structured fields below — the document is assembled deterministically, not by an AI model."
      className="sm:max-w-xl"
      footer={
        <Button onClick={handleSubmit} disabled={!documentType || isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate draft"}
        </Button>
      }
    >
      <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
        <div className="space-y-1.5">
          <Label>Document type</Label>
          <Select value={documentType} onValueChange={handleTypeChange}>
            <SelectTrigger aria-label="Document type">
              <SelectValue placeholder="Select a document type" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPE_CATALOG.map((meta) => (
                <SelectItem key={meta.type} value={meta.type}>
                  {meta.label} <span className="text-muted-foreground">· {meta.category}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {documentType ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Link to matter (optional)</Label>
                <Select value={matterId} onValueChange={setMatterId}>
                  <SelectTrigger aria-label="Link to matter (optional)">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {matters.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Link to client (optional)</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger aria-label="Link to client (optional)">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {fields.map((field) => {
              const inputId = `doc-gen-field-${field.name}`;
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={inputId}>{field.label}</Label>
                  {field.kind === "textarea" ? (
                    <Textarea
                      id={inputId}
                      value={values[field.name] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    />
                  ) : (
                    <Input
                      id={inputId}
                      type={field.kind === "number" ? "number" : field.kind === "date" ? "date" : field.kind === "email" ? "email" : "text"}
                      value={values[field.name] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    />
                  )}
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    </FormModal>
  );
}
