"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Receipt, Wallet, CreditCard, PiggyBank } from "lucide-react";
import { invoiceColumns, paymentColumns, expenseColumns, retainerColumns } from "@/features/billing/columns";
import type { InvoiceListItem, PaymentListItem, ExpenseListItem, RetainerListItem } from "@/features/billing/queries";

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
  return (
    <Tabs defaultValue="invoices" className="gap-4">
      <TabsList>
        <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
        <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
        <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
        <TabsTrigger value="retainers">Retainers ({retainers.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="invoices">
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          emptyIcon={Receipt}
          emptyTitle="No invoices yet"
          emptyDescription="Invoices generated for clients will appear here."
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
