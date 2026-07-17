"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Wallet, CreditCard, PiggyBank } from "lucide-react";
import { invoiceColumns, paymentColumns, expenseColumns, retainerColumns } from "@/features/billing/columns";
import type { InvoiceListItem, PaymentListItem, ExpenseListItem, RetainerListItem } from "@/features/billing/queries";
import { useTableFilters } from "@/hooks/use-table-filters";
import { RecordPaymentDialog } from "@/components/billing/record-payment-dialog";

function InvoicesTab({ invoices, onRowClick }: { invoices: InvoiceListItem[]; onRowClick?: (invoice: InvoiceListItem) => void }) {
  const clients = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const i of invoices) map.set(i.client.id, i.client.name);
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [invoices]);

  const { search, setSearch, filterValue: status, setFilterValue: setStatus, filters, setFilter, filtered } = useTableFilters(
    invoices,
    {
      search: (i, q) => i.invoiceNumber.toLowerCase().includes(q) || i.client.name.toLowerCase().includes(q),
      filter: (i, value) => i.status === value,
      filters: { client: (i, value) => i.client.id === value },
    },
  );

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoices by number, client..."
        filters={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="VOID">Void</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.client ?? "ALL"} onValueChange={(v) => setFilter("client", v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All clients</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />
      <DataTable
        columns={invoiceColumns}
        data={filtered}
        emptyIcon={Receipt}
        emptyTitle="No invoices found"
        emptyDescription="Try adjusting your search or filters, or generate a new invoice."
        onRowClick={onRowClick}
      />
    </div>
  );
}

export function BillingTabs({
  invoices,
  payments,
  expenses,
  retainers,
}: {
  invoices: InvoiceListItem[];
  payments: PaymentListItem[];
  expenses: ExpenseListItem[];
  retainers: RetainerListItem[];
}) {
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceListItem | null>(null);

  return (
    <Tabs defaultValue="invoices" className="gap-4">
      <TabsList>
        <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
        <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
        <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
        <TabsTrigger value="retainers">Retainers ({retainers.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="invoices">
        <InvoicesTab invoices={invoices} onRowClick={setSelectedInvoice} />
        <RecordPaymentDialog
          invoice={selectedInvoice}
          open={selectedInvoice !== null}
          onOpenChange={(open) => !open && setSelectedInvoice(null)}
        />
      </TabsContent>
      <TabsContent value="payments">
        <DataTable
          columns={paymentColumns}
          data={payments}
          emptyIcon={CreditCard}
          emptyTitle="No payments recorded"
          emptyDescription="Payments received against invoices will appear here."
        />
      </TabsContent>
      <TabsContent value="expenses">
        <DataTable
          columns={expenseColumns}
          data={expenses}
          emptyIcon={Wallet}
          emptyTitle="No expenses logged"
          emptyDescription="Matter and firm expenses will appear here."
        />
      </TabsContent>
      <TabsContent value="retainers">
        <DataTable
          columns={retainerColumns}
          data={retainers}
          emptyIcon={PiggyBank}
          emptyTitle="No retainers on file"
          emptyDescription="Active client retainers will appear here."
        />
      </TabsContent>
    </Tabs>
  );
}
