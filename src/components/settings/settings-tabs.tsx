"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Palette } from "lucide-react";
import { formatCurrency, initials } from "@/lib/format";
import { toggleUserStatus } from "@/features/settings/actions";
import { CourtListManager } from "@/components/settings/court-list-manager";
import { PERMISSION_ROLES, PERMISSION_MATRIX, type AccessLevel } from "@/lib/constants/permission-matrix";
import type { getSettingsData } from "@/features/settings/queries";

const ACCESS_STYLE: Record<AccessLevel, string> = {
  F: "bg-success/10 text-success",
  C: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  V: "bg-muted text-muted-foreground",
  "—": "text-muted-foreground/40",
};

export function SettingsTabs({ data }: { data: Awaited<ReturnType<typeof getSettingsData>> }) {
  const { firm, offices, practiceAreas, courts, templateCount, users } = data;

  return (
    <Tabs defaultValue="firm" className="gap-4">
      <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        <TabsTrigger value="firm">Firm Profile</TabsTrigger>
        <TabsTrigger value="offices">Offices ({offices.length})</TabsTrigger>
        <TabsTrigger value="practice-areas">Practice Areas ({practiceAreas.length})</TabsTrigger>
        <TabsTrigger value="courts">Court List ({courts.length})</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="invoicing">Invoice Settings</TabsTrigger>
        <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="firm">
        {firm ? (
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Firm name" value={firm.name} />
              <Field label="Legal name" value={firm.legalName ?? "—"} />
              <Field label="Tagline" value={firm.tagline ?? "—"} />
              <Field label="Founded" value={firm.foundedYear ? String(firm.foundedYear) : "—"} />
              <Field label="Email" value={firm.email ?? "—"} />
              <Field label="Phone" value={firm.phone ?? "—"} />
              <Field label="Website" value={firm.website ?? "—"} />
              <Field label="Tax ID" value={firm.taxId ?? "—"} />
              <Field label="Address" value={[firm.addressLine1, firm.city, firm.state, firm.postalCode].filter(Boolean).join(", ")} />
              <Field label="Timezone / Currency" value={`${firm.timezone} · ${firm.currency}`} />
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>

      <TabsContent value="offices" className="space-y-2">
        {offices.map((office) => (
          <Card key={office.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {office.name}
                  {office.isPrimary ? <Badge>Head Office</Badge> : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[office.addressLine1, office.city, office.state].filter(Boolean).join(", ")}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{office.phone}</p>
                <p>{office.email}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="practice-areas">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {practiceAreas.map((pa) => (
            <Card key={pa.id} className="gap-2 py-4">
              <CardContent className="space-y-1 px-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: pa.color }} />
                  <p className="text-sm font-medium text-foreground">{pa.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{pa.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="courts">
        <CourtListManager courts={courts} />
      </TabsContent>

      <TabsContent value="templates">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{templateCount} templates in the library</p>
              <p className="text-xs text-muted-foreground">Manage default templates from the Template Library module.</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/managing-partner/template-library">Open Template Library</a>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="branding">
        <EmptyState
          icon={Palette}
          title="Branding settings coming soon"
          description="Upload the firm logo and customise the brand accent color from here in a future release."
        />
      </TabsContent>

      <TabsContent value="invoicing">
        {firm ? (
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Invoice prefix" value={firm.invoicePrefix} />
              <Field label="Next invoice number" value={String(firm.invoiceNextNumber)} />
              <Field label="Currency" value={firm.currency} />
              <Field label="Financial year start month" value={String(firm.financialYearStart)} />
              <Field label="Default retainer balance held" value={formatCurrency(0)} />
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>

      <TabsContent value="users" className="space-y-2">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.email} · {u.office?.name ?? "No office"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant="outline">{u.role.replace(/_/g, " ")}</Badge>
                <form action={toggleUserStatus.bind(null, u.id)}>
                  <Button type="submit" size="sm" variant={u.status === "ACTIVE" ? "outline" : "default"}>
                    {u.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="permissions">
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 bg-card px-3 py-2 text-left font-medium text-muted-foreground">Module</th>
                  {PERMISSION_ROLES.map((role) => (
                    <th key={role} className="px-2 py-2 text-center text-xs font-medium whitespace-nowrap text-muted-foreground">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_MATRIX.map((row) => (
                  <tr key={row.module} className="border-b border-border/60 last:border-0">
                    <td className="sticky left-0 bg-card px-3 py-2 text-foreground">{row.module}</td>
                    {row.access.map((level, i) => (
                      <td key={i} className="px-2 py-2 text-center">
                        <span className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${ACCESS_STYLE[level]}`}>
                          {level}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p className="mt-3 text-xs text-muted-foreground">
          <strong>F</strong> = Full access · <strong>C</strong> = Contribute (scoped to own matters/clients) · <strong>V</strong> = View only · <strong>—</strong> = No access
        </p>
      </TabsContent>
    </Tabs>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
