"use server";

import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus, LineItemType, MatterStage, NotificationType } from "@/generated/prisma/client";
import { createInvoiceSchema, recordPaymentSchema, type CreateInvoiceInput, type RecordPaymentInput } from "@/features/billing/schema";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/services/activity";
import { notifyUsers } from "@/lib/services/notifications";
import { bumpMatterStageIfEarlier } from "@/lib/services/workflow-server";
import { assertInvoiceHasBillableItems } from "@/lib/services/validation";

export async function generateInvoiceFromUnbilledTime(matterId: string) {
  const matter = await prisma.matter.findUniqueOrThrow({ where: { id: matterId } });
  const actor = await requireUser();
  const entries = await prisma.timeEntry.findMany({
    where: { matterId, billable: true, invoiced: false },
    include: { user: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  assertInvoiceHasBillableItems(entries);

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

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
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

    await tx.timeEntry.updateMany({
      where: { id: { in: entries.map((e) => e.id) } },
      data: { invoiced: true },
    });

    await logActivity(
      {
        action: "generated an invoice from unbilled time",
        entityType: "INVOICE",
        entityId: created.id,
        matterId: matter.id,
        clientId: matter.clientId,
        actorId: actor.id,
        currentValue: `${created.invoiceNumber} · ${total}`,
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );

    return created;
  });

  await bumpMatterStageIfEarlier(matter.id, matter.stage, MatterStage.BILLING);

  revalidatePath("/", "layout");
  return invoice;
}

export async function createInvoice(input: CreateInvoiceInput) {
  const data = createInvoiceSchema.parse(input);
  const actor = await requireUser();

  const firm = await prisma.firm.findFirst();
  const count = await prisma.invoice.count();
  const invoiceNumber = `${firm?.invoicePrefix ?? "LEX-INV"}-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

  const subtotal = data.amount;
  const taxAmount = Math.round(subtotal * 0.18);
  const total = subtotal + taxAmount;
  const lineItems = [{ description: data.description, quantity: 1, rate: data.amount, amount: data.amount, type: LineItemType.FEE }];
  assertInvoiceHasBillableItems(lineItems);

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
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
        lineItems: { create: lineItems },
      },
    });

    await logActivity(
      {
        action: "created an invoice",
        entityType: "INVOICE",
        entityId: created.id,
        matterId: data.matterId || null,
        clientId: data.clientId,
        actorId: actor.id,
        currentValue: `${created.invoiceNumber} · ${total}`,
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );

    return created;
  });

  if (data.matterId) {
    const matter = await prisma.matter.findUniqueOrThrow({ where: { id: data.matterId } });
    await bumpMatterStageIfEarlier(data.matterId, matter.stage, MatterStage.BILLING);
  }

  revalidatePath("/", "layout");
  return invoice;
}

/** Records a payment against an invoice and cascades: invoice balance, matter payment history/stage, client outstanding, dashboard/reports (via revalidation). */
export async function recordPayment(invoiceId: string, input: RecordPaymentInput) {
  const data = recordPaymentSchema.parse(input);
  const actor = await requireUser();

  const invoice = await prisma.invoice.findUniqueOrThrow({ where: { id: invoiceId } });
  if (invoice.status === InvoiceStatus.VOID) {
    throw new Error("Cannot record a payment against a voided invoice.");
  }

  const amountPaid = invoice.amountPaid + data.amount;
  const nextStatus = amountPaid >= invoice.total ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;

  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.payment.create({
      data: {
        invoiceId,
        clientId: invoice.clientId,
        amount: data.amount,
        method: data.method,
        reference: data.reference || null,
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      },
    });

    await tx.invoice.update({ where: { id: invoiceId }, data: { amountPaid, status: nextStatus } });

    await logActivity(
      {
        action: "recorded a payment",
        entityType: "INVOICE",
        entityId: invoiceId,
        matterId: invoice.matterId,
        clientId: invoice.clientId,
        actorId: actor.id,
        previousValue: invoice.status,
        currentValue: nextStatus,
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );

    if (invoice.matterId) {
      const responsible = await tx.matter.findUnique({ where: { id: invoice.matterId }, select: { responsibleAttorneyId: true } });
      if (responsible) {
        await notifyUsers(
          {
            userIds: [responsible.responsibleAttorneyId],
            type: NotificationType.INVOICE,
            title: `Payment received — ${invoice.invoiceNumber}`,
            body: `${data.amount} received. Invoice is now ${nextStatus === InvoiceStatus.PAID ? "paid in full" : "partially paid"}.`,
            matterId: invoice.matterId,
          },
          tx,
        );
      }
    }

    return created;
  });

  if (invoice.matterId && nextStatus === InvoiceStatus.PAID) {
    const matter = await prisma.matter.findUniqueOrThrow({ where: { id: invoice.matterId } });
    await bumpMatterStageIfEarlier(invoice.matterId, matter.stage, MatterStage.PAYMENT);
  }

  revalidatePath("/", "layout");
  return payment;
}
