"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormModal } from "@/components/shared/form-modal";
import { createCourtListEntry, deleteCourtListEntry } from "@/features/settings/actions";
import { CourtType } from "@/generated/prisma/client";

type CourtListEntry = {
  id: string;
  name: string;
  type: CourtType;
  city: string | null;
  state: string | null;
  caseNumberPattern: string | null;
};

const COURT_TYPE_OPTIONS: { value: CourtType; label: string }[] = [
  { value: "SUPREME_COURT", label: "Supreme Court" },
  { value: "HIGH_COURT", label: "High Court" },
  { value: "DISTRICT_COURT", label: "District Court" },
  { value: "TRIBUNAL", label: "Tribunal" },
  { value: "CONSUMER_FORUM", label: "Consumer Forum" },
  { value: "FAMILY_COURT", label: "Family Court" },
  { value: "ARBITRATION", label: "Arbitration" },
];

export function CourtListManager({ courts }: { courts: CourtListEntry[] }) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<CourtType>("DISTRICT_COURT");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [pattern, setPattern] = React.useState("");

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Court name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      await createCourtListEntry({ name, type, city, state, caseNumberPattern: pattern });
      toast.success("Court added to the list");
      setOpen(false);
      setName("");
      setCity("");
      setState("");
      setPattern("");
    } catch {
      toast.error("Could not add court. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string, courtName: string) {
    try {
      await deleteCourtListEntry(id);
      toast.success(`${courtName} removed`);
    } catch {
      toast.error("Could not remove court.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <FormModal
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add court
            </Button>
          }
          title="Add court to the list"
          description="Configure the court name, type, and its case-numbering pattern for validation."
          open={open}
          onOpenChange={setOpen}
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add court"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="court-name">Court name</Label>
              <Input id="court-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gujarat High Court" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="court-type">Court type</Label>
              <Select value={type} onValueChange={(v) => setType(v as CourtType)}>
                <SelectTrigger id="court-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COURT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="court-city">City</Label>
                <Input id="court-city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="court-state">State</Label>
                <Input id="court-state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="court-pattern">Case number pattern</Label>
              <Input
                id="court-pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. CS/\d{3}/\d{4}"
              />
              <p className="text-xs text-muted-foreground">
                Jurisdiction-specific format used to validate case numbers filed at this court.
              </p>
            </div>
          </div>
        </FormModal>
      </div>

      {courts.map((court) => (
        <Card key={court.id}>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{court.name}</p>
              <p className="text-xs text-muted-foreground">
                {court.city}, {court.state}
                {court.caseNumberPattern ? ` · Pattern: ${court.caseNumberPattern}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="outline">{court.type.replace(/_/g, " ")}</Badge>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(court.id, court.name)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
