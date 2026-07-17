"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { DocumentStatus, NotificationType } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/services/activity";
import { notifyUsers } from "@/lib/services/notifications";
import { assertDocumentSigned, BusinessRuleError } from "@/lib/services/validation";
import { assertValidDocumentTransition, DOCUMENT_STAGE_LABELS } from "@/lib/services/workflow";

async function transitionDocument(documentId: string, target: DocumentStatus, extra: Record<string, unknown> = {}) {
  const actor = await requireUser();
  const document = await prisma.documentFile.findUniqueOrThrow({ where: { id: documentId } });
  assertValidDocumentTransition(document.status, target);

  const updated = await prisma.documentFile.update({
    where: { id: documentId },
    data: { status: target, ...extra },
  });

  await logActivity({
    action: `moved document to ${DOCUMENT_STAGE_LABELS[target]}`,
    entityType: "DOCUMENT",
    entityId: documentId,
    matterId: document.matterId,
    clientId: document.clientId,
    actorId: actor.id,
    previousValue: document.status,
    currentValue: target,
    source: "WORKFLOW_ENGINE",
  });

  revalidatePath("/", "layout");
  return { updated, document, actor };
}

export async function submitDocumentForReview(documentId: string) {
  const { updated } = await transitionDocument(documentId, DocumentStatus.REVIEW, { submittedForReviewAt: new Date() });
  return updated;
}

export async function completeDocumentReview(documentId: string) {
  const { updated, document } = await transitionDocument(documentId, DocumentStatus.PARTNER_APPROVAL, {
    reviewedById: (await requireUser()).id,
  });
  await notifyUsers({
    userIds: [document.uploadedById],
    type: NotificationType.DOCUMENT,
    title: `Document ready for partner approval: ${document.name}`,
    matterId: document.matterId,
  });
  return updated;
}

/** Reviewer sends the draft back for changes instead of approving it — the one legitimate backward move in the pipeline. */
export async function requestDocumentChanges(documentId: string, comment: string) {
  const actor = await requireUser();
  const document = await prisma.documentFile.findUniqueOrThrow({ where: { id: documentId } });
  if (document.status !== DocumentStatus.REVIEW) {
    throw new BusinessRuleError("Only a document currently in review can be sent back for changes.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.documentFile.update({ where: { id: documentId }, data: { status: DocumentStatus.DRAFT } });
    await tx.documentComment.create({ data: { documentId, authorId: actor.id, body: comment } });
    await logActivity(
      {
        action: "requested changes on document",
        entityType: "DOCUMENT",
        entityId: documentId,
        matterId: document.matterId,
        clientId: document.clientId,
        actorId: actor.id,
        previousValue: DocumentStatus.REVIEW,
        currentValue: DocumentStatus.DRAFT,
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );
    return result;
  });

  await notifyUsers({
    userIds: [document.uploadedById],
    type: NotificationType.DOCUMENT,
    title: `Changes requested on: ${document.name}`,
    body: comment,
    matterId: document.matterId,
  });

  revalidatePath("/", "layout");
  return updated;
}

export async function partnerApproveDocument(documentId: string) {
  const actor = await requireUser();
  const { updated, document } = await transitionDocument(documentId, DocumentStatus.CLIENT_APPROVAL, {
    approvedById: actor.id,
    approvedAt: new Date(),
  });
  await notifyUsers({
    userIds: [document.uploadedById],
    type: NotificationType.DOCUMENT,
    title: `Document approved, awaiting client: ${document.name}`,
    matterId: document.matterId,
  });
  return updated;
}

/** The client's approval doubles as execution in this model — moves straight to Signed. */
export async function clientApproveDocument(documentId: string) {
  const now = new Date();
  const { updated } = await transitionDocument(documentId, DocumentStatus.SIGNED, {
    clientApprovedAt: now,
    signedAt: now,
  });
  return updated;
}

export async function fileDocument(documentId: string) {
  const document = await prisma.documentFile.findUniqueOrThrow({ where: { id: documentId } });
  assertDocumentSigned(document);
  const { updated } = await transitionDocument(documentId, DocumentStatus.FILED, { filedAt: new Date() });
  return updated;
}

export async function addDocumentComment(documentId: string, body: string) {
  const actor = await requireUser();
  const document = await prisma.documentFile.findUniqueOrThrow({ where: { id: documentId } });

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.documentComment.create({ data: { documentId, authorId: actor.id, body } });
    await logActivity(
      {
        action: "commented on a document",
        entityType: "DOCUMENT",
        entityId: documentId,
        matterId: document.matterId,
        clientId: document.clientId,
        actorId: actor.id,
        currentValue: body,
        source: "WORKFLOW_ENGINE",
      },
      tx,
    );
    return created;
  });

  revalidatePath("/", "layout");
  return comment;
}
