import { prisma } from "@/lib/db/prisma";
import { InvoiceStatus, HearingStatus, MatterStatus, DocumentStatus } from "@/generated/prisma/client";
import { BusinessRuleError } from "@/lib/services/errors";

export { BusinessRuleError };

export async function assertMatterHasNoUnpaidInvoices(matterId: string) {
  const unpaid = await prisma.invoice.count({
    where: { matterId, status: { in: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] } },
  });
  if (unpaid > 0) {
    throw new BusinessRuleError("Cannot close this matter — it has unpaid invoices outstanding.");
  }
}

export async function assertMatterHasNoPendingHearings(matterId: string) {
  const pending = await prisma.hearing.count({ where: { matterId, status: HearingStatus.SCHEDULED } });
  if (pending > 0) {
    throw new BusinessRuleError("Cannot archive this matter — it still has hearings scheduled.");
  }
}

export async function assertClientHasNoActiveMatters(clientId: string) {
  const active = await prisma.matter.count({
    where: { clientId, status: { in: [MatterStatus.INTAKE, MatterStatus.ACTIVE, MatterStatus.ON_HOLD] } },
  });
  if (active > 0) {
    throw new BusinessRuleError("Cannot archive this client — it has active matters.");
  }
}

export function assertDocumentSigned(document: { status: DocumentStatus }) {
  if (document.status !== DocumentStatus.SIGNED) {
    throw new BusinessRuleError("Cannot file a document that has not been signed.");
  }
}

export function assertInvoiceHasBillableItems(lineItems: unknown[]) {
  if (lineItems.length === 0) {
    throw new BusinessRuleError("Cannot generate an invoice without billable items.");
  }
}
