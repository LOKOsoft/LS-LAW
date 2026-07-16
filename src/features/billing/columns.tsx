"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { InvoiceStatusPill } from "@/components/shared/status-pill";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { InvoiceListItem, PaymentListItem, ExpenseListItem, RetainerListItem } from "@/features/billing/queries";

export const invoiceColumns: ColumnDef<InvoiceListItem>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{row.original.invoiceNumber}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.client.name}{row.original.matter ? ` · ${row.original.matter.title}` : ""}</p>
      </div>
    ),
  },
  { accessorKey: "issueDate", header: "Issued", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.issueDate)}</span> },
  { accessorKey: "dueDate", header: "Due", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.dueDate)}</span> },
  { accessorKey: "total", header: "Total", cell: ({ row }) => <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(row.original.total)}</span> },
  { accessorKey: "amountPaid", header: "Paid", cell: ({ row }) => <span className="text-sm tabular-nums text-muted-foreground">{formatCurrency(row.original.amountPaid)}</span> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <InvoiceStatusPill status={row.original.status} /> },
];

export const paymentColumns: ColumnDef<PaymentListItem>[] = [
  { accessorKey: "invoice.invoiceNumber", header: "Invoice", cell: ({ row }) => <span className="text-sm font-medium text-foreground">{row.original.invoice.invoiceNumber}</span> },
  { accessorKey: "client.name", header: "Client", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.client.name}</span> },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(row.original.amount)}</span> },
  { accessorKey: "method", header: "Method", cell: ({ row }) => <Badge variant="outline">{row.original.method.replace("_", " ")}</Badge> },
  { accessorKey: "reference", header: "Reference", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.reference}</span> },
  { accessorKey: "paidAt", header: "Paid on", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.paidAt)}</span> },
];

export const expenseColumns: ColumnDef<ExpenseListItem>[] = [
  {
    accessorKey: "description",
    header: "Expense",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{row.original.description}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.matter?.title ?? row.original.client?.name ?? "—"}</p>
      </div>
    ),
  },
  { accessorKey: "category", header: "Category", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.category}</span> },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(row.original.amount)}</span> },
  { accessorKey: "billable", header: "Billable", cell: ({ row }) => <Badge variant={row.original.billable ? "default" : "secondary"}>{row.original.billable ? "Billable" : "Non-billable"}</Badge> },
  { accessorKey: "reimbursed", header: "Reimbursed", cell: ({ row }) => <Badge variant={row.original.reimbursed ? "default" : "outline"}>{row.original.reimbursed ? "Reimbursed" : "Pending"}</Badge> },
  { accessorKey: "incurredAt", header: "Date", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.incurredAt)}</span> },
];

export const retainerColumns: ColumnDef<RetainerListItem>[] = [
  { accessorKey: "client.name", header: "Client", cell: ({ row }) => <span className="text-sm font-medium text-foreground">{row.original.client.name}</span> },
  { accessorKey: "matter.title", header: "Matter", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.matter?.title ?? "—"}</span> },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{formatCurrency(row.original.amount)}</span> },
  { accessorKey: "balance", header: "Balance", cell: ({ row }) => <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(row.original.balance)}</span> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge> },
  { accessorKey: "startDate", header: "Started", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.startDate)}</span> },
];
