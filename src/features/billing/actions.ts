"use server";

import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus, LineItemType } from "@/generated/prisma/client";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/features/billing/schema";

export async function generateInvoiceFromUnbilledTime(matterId: string) {
  const matter = await prisma.matter.findUniqueOrThrow({ where: { id: matterId } });
  const entries = await prisma.timeEntry.findMany({
    where: { matterId, billable: true, invoiced: false },
    include: { user: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  if (entries.length === 0) {
    throw new Error("No unbilled time entries for this matter.");
  }

  const rate = matter.hourlyRate ?? 0;
  const lineItems = entries.map((entry) => {
    const hours = entry.minutes / 60;
    const itemRate = entry.rate ?? rate;
    return {
      description: `${entry.user.name} — ${entry.description} (${hours.toFixed(1)}h on ${entry.date.toISOString().slice(0, 10)})`,
      quantity: Math.round(hours * 100) / 100,
      rate: itemRate,
      amount: Math.round(hours * itemRate),
      type: LineItemType.FEE,
    };
  });
  const subtotal = lineItems.reduce((sum, li) => sum + li.amount, 0);
  const taxAmount = Math.round(subtotal * 0.18);
  const total = subtotal + taxAmount;

  const firm = await prisma.firm.findFirst();
  const count = await prisma.invoice.count();
  const invoiceNumber = `${firm?.invoicePrefix ?? "LEX-INV"}-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId: matter.clientId,
      matterId: matter.id,
      status: InvoiceStatus.DRAFT,
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      subtotal,
      taxAmount,
      total,
      lineItems: { create: lineItems },
    },
  });

  await prisma.timeEntry.updateMany({
    where: { id: { in: entries.map((e) => e.id) } },
    data: { invoiced: true },
  });

  revalidatePath("/", "layout");
  return invoice;
}

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

  revalidatePath("/", "layout");
  return invoice;
}
