"use server";

import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus, LineItemType } from "@/generated/prisma/client";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/features/billing/schema";

export async function createInvoice(input: CreateInvoiceInput) {
  const data = createInvoiceSchema.parse(input);

  const firm = await prisma.firm.findFirst();
  const count = await prisma.invoice.count();
  const invoiceNumber = `${firm?.invoicePrefix ?? "LEX-INV"}-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

  const subtotal = data.amount;
  const taxAmount = Math.round(subtotal * 0.18);
  const total = subtotal + taxAmount;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId: data.clientId,
      matterId: data.matterId || null,
      status: InvoiceStatus.DRAFT,
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      subtotal,
      taxAmount,
      total,
      lineItems: {
        create: [{ description: data.description, quantity: 1, rate: data.amount, amount: data.amount, type: LineItemType.FEE }],
      },
    },
  });

  revalidatePath("/managing-partner/billing");
  revalidatePath("/managing-partner");
  return invoice;
}
