"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, ShieldCheck, Palette } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { getSettingsData } from "@/features/settings/queries";

export function SettingsTabs({ data }: { data: Awaited<ReturnType<typeof getSettingsData>> }) {
  const { firm, offices, practiceAreas, courts, templateCount } = data;

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
        <TabsTrigger value="users">Users</TabsTrigger>
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

      <TabsContent value="courts" className="space-y-2">
        {courts.map((court) => (
          <Card key={court.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{court.name}</p>
                <p className="text-xs text-muted-foreground">{court.city}, {court.state}</p>
              </div>
              <Badge variant="outline">{court.type.replace(/_/g, " ")}</Badge>
            </CardContent>
          </Card>
        ))}
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

      <TabsContent value="users">
        <EmptyState
          icon={Users}
          title="User management placeholder"
          description="Phase 1 uses route-based access with no login. Full user management arrives when authentication is introduced."
        />
      </TabsContent>

      <TabsContent value="permissions">
        <EmptyState
          icon={ShieldCheck}
          title="Permissions placeholder"
          description="Role-based permissions will be configurable here once authentication is added to LEXORA."
        />
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
