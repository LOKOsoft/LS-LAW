"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Upload, FileWarning, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/shared/empty-state";
import { importClientRowSchema, type ImportClientRow } from "@/features/clients/schema";
import { bulkImportClients } from "@/features/clients/actions";
import { toCsv, downloadCsv, parseCsv } from "@/lib/csv";
import type { ManagerOption } from "@/components/clients/client-form-fields";

const TEMPLATE_HEADERS = ["name", "type", "industry", "email", "phone", "city", "state", "taxId"];
const HEADER_ALIASES: Record<string, keyof ImportClientRow> = {
  name: "name",
  "client name": "name",
  type: "type",
  "client type": "type",
  industry: "industry",
  email: "email",
  phone: "phone",
  city: "city",
  state: "state",
  taxid: "taxId",
  "tax id": "taxId",
  gstin: "taxId",
  pan: "taxId",
};

type ParsedRow = {
  raw: Record<string, string>;
  data?: ImportClientRow;
  error?: string;
};

export function ImportClientsView({
  managers,
  currentUserId,
  basePath = "/managing-partner",
}: {
  managers: ManagerOption[];
  currentUserId: string;
  basePath?: string;
}) {
  const [raw, setRaw] = React.useState("");
  const [managerId, setManagerId] = React.useState(managers[0]?.id ?? "");
  const [rows, setRows] = React.useState<ParsedRow[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  function downloadTemplate() {
    const sampleRow: Record<(typeof TEMPLATE_HEADERS)[number], string> = {
      name: "Meridian Textiles Pvt. Ltd.",
      type: "COMPANY",
      industry: "Manufacturing",
      email: "contact@meridiantextiles.com",
      phone: "+91 9820012345",
      city: "Mumbai",
      state: "Maharashtra",
      taxId: "27AAFCM1234K1ZQ",
    };
    const csv = toCsv([sampleRow], TEMPLATE_HEADERS.map((key) => ({ key, label: key })));
    downloadCsv("lexora-client-import-template.csv", csv);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRaw(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  function parse() {
    const table = parseCsv(raw);
    if (table.length < 2) {
      toast.error("No data rows found", { description: "Paste CSV data with a header row plus at least one client row." });
      setRows([]);
      return;
    }
    const [headerRow, ...dataRows] = table;
    const headers = headerRow.map((h) => h.trim().toLowerCase());

    const parsed: ParsedRow[] = dataRows.map((cells) => {
      const raw: Record<string, string> = {};
      const candidate: Record<string, string> = {};
      headers.forEach((h, i) => {
        raw[h] = cells[i] ?? "";
        const mapped = HEADER_ALIASES[h];
        if (mapped) candidate[mapped] = (cells[i] ?? "").trim();
      });
      if (!candidate.type) candidate.type = "COMPANY";
      const result = importClientRowSchema.safeParse({ ...candidate, relationshipManagerId: managerId });
      if (result.success) return { raw, data: result.data };
      return { raw, error: result.error.issues[0]?.message ?? "Invalid row" };
    });

    setRows(parsed);
  }

  const validRows = rows.filter((r) => r.data).map((r) => r.data!);
  const errorCount = rows.length - validRows.length;

  async function handleImport() {
    if (validRows.length === 0) return;
    setIsSubmitting(true);
    try {
      const created = await bulkImportClients(validRows, currentUserId);
      toast.success(`Imported ${created.length} client${created.length === 1 ? "" : "s"}`, {
        description: "New clients are now visible in the client list.",
      });
      setRows([]);
      setRaw("");
      router.push(`${basePath}/clients`);
      router.refresh();
    } catch {
      toast.error("Import failed. Please check the data and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">1. Prepare your CSV</p>
              <p className="text-xs text-muted-foreground">Columns: name, type (Company/Individual), industry, email, phone, city, state, taxId.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={downloadTemplate}>
              <Download className="size-4" />
              Download template
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">2. Assign a relationship manager</p>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Select a partner" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} {m.title ? `· ${m.title}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Applied to every imported client unless the CSV overrides it.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">3. Paste or upload CSV data</p>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                <Upload className="size-4" />
                Upload file
              </Button>
              <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
            </div>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={"name,type,industry,email,phone,city,state,taxId\nMeridian Textiles Pvt. Ltd.,COMPANY,Manufacturing,contact@meridiantextiles.com,+91 9820012345,Mumbai,Maharashtra,27AAFCM1234K1ZQ"}
              className="min-h-32 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={parse} disabled={raw.trim().length === 0}>
              Preview import
            </Button>
          </div>
        </CardContent>
      </Card>

      {rows.length > 0 ? (
        <Card>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StatusPill label={`${validRows.length} ready`} tone="success" />
                {errorCount > 0 ? <StatusPill label={`${errorCount} need attention`} tone="destructive" /> : null}
              </div>
              <Button onClick={handleImport} disabled={isSubmitting || validRows.length === 0} className="gap-1.5">
                <CheckCircle2 className="size-4" />
                {isSubmitting ? "Importing..." : `Import ${validRows.length} client${validRows.length === 1 ? "" : "s"}`}
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.data?.name ?? row.raw.name ?? "—"}</TableCell>
                    <TableCell>{row.data?.type ?? row.raw.type ?? "—"}</TableCell>
                    <TableCell>{row.data?.industry ?? "—"}</TableCell>
                    <TableCell>{row.data?.email ?? "—"}</TableCell>
                    <TableCell>{row.data?.phone ?? "—"}</TableCell>
                    <TableCell>
                      {row.error ? (
                        <span className="flex items-center gap-1.5 text-destructive">
                          <FileWarning className="size-3.5" />
                          <span className="text-xs">{row.error}</span>
                        </span>
                      ) : (
                        <StatusPill label="Valid" tone="success" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Upload}
          title="No preview yet"
          description="Paste or upload CSV data above, then select Preview import to validate rows before importing."
        />
      )}
    </div>
  );
}
