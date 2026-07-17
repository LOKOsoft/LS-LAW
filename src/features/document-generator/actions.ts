"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import type { GeneratedDocumentType } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/dal";
import { logActivity } from "@/lib/services/activity";
import { BusinessRuleError } from "@/lib/services/errors";
import { generateDocumentContent, suggestDocumentTitle, extractExpiryDate } from "@/features/document-generator/generator";
import { getStorageProvider } from "@/lib/platform/storage";
import { getGeneratedDocumentById as getGeneratedDocumentByIdQuery } from "@/features/document-generator/queries";

/**
 * Server Action wrapper around the `queries.ts` read — Client Components
 * can only invoke functions from a `"use server"` file (like this one);
 * calling a plain query function directly from client code would bundle
 * Prisma/better-sqlite3 into the browser build and fail. See
 * `components/document-generator/generated-documents-list.tsx`.
 */
export async function getGeneratedDocumentDetail(id: string) {
  return getGeneratedDocumentByIdQuery(id);
}

export async function createGeneratedDocument(input: {
  documentType: GeneratedDocumentType;
  formData: Record<string, unknown>;
  matterId?: string;
  clientId?: string;
}) {
  const actor = await requireUser();
  const content = generateDocumentContent(input.documentType, input.formData);
  const title = suggestDocumentTitle(input.documentType, input.formData);
  const expiresAt = extractExpiryDate(input.documentType, input.formData);

  const document = await prisma.generatedDocument.create({
    data: {
      documentType: input.documentType,
      title,
      formData: JSON.stringify(input.formData),
      content,
      expiresAt,
      matterId: input.matterId ?? null,
      clientId: input.clientId ?? null,
      createdById: actor.id,
      versions: { create: { version: 1, content, createdById: actor.id, note: "Initial draft" } },
    },
  });

  await logActivity({
    action: "generated a document",
    entityType: "GENERATED_DOCUMENT",
    entityId: document.id,
    matterId: input.matterId ?? null,
    clientId: input.clientId ?? null,
    actorId: actor.id,
    currentValue: title,
    source: "AI_DOCUMENT_GENERATOR",
  });

  revalidatePath("/", "layout");
  return document;
}

/** Regenerates content from edited form data — a revision, not a fresh document; bumps the version and resets to DRAFT if it had moved further along. */
export async function reviseGeneratedDocument(id: string, formData: Record<string, unknown>) {
  const actor = await requireUser();
  const existing = await prisma.generatedDocument.findUniqueOrThrow({ where: { id } });

  const content = generateDocumentContent(existing.documentType, formData);
  const expiresAt = extractExpiryDate(existing.documentType, formData);
  const nextVersion = existing.version + 1;

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.generatedDocument.update({
      where: { id },
      data: {
        formData: JSON.stringify(formData),
        content,
        expiresAt,
        version: nextVersion,
        status: "DRAFT",
        revisionNote: null,
      },
    });
    await tx.generatedDocumentVersion.create({
      data: { generatedDocumentId: id, version: nextVersion, content, createdById: actor.id, note: "Revised draft" },
    });
    return result;
  });

  revalidatePath("/", "layout");
  return updated;
}

export async function submitGeneratedDocumentForReview(id: string) {
  const actor = await requireUser();
  const existing = await prisma.generatedDocument.findUniqueOrThrow({ where: { id } });
  if (existing.status !== "DRAFT" && existing.status !== "REVISION_REQUESTED") {
    throw new BusinessRuleError("Only a draft or revised document can be submitted for review.");
  }

  const updated = await prisma.generatedDocument.update({ where: { id }, data: { status: "IN_REVIEW" } });
  await logActivity({
    action: "submitted generated document for review",
    entityType: "GENERATED_DOCUMENT",
    entityId: id,
    matterId: existing.matterId,
    clientId: existing.clientId,
    actorId: actor.id,
    source: "AI_DOCUMENT_GENERATOR",
  });
  revalidatePath("/", "layout");
  return updated;
}

export async function requestGeneratedDocumentRevision(id: string, note: string) {
  const actor = await requireUser();
  const existing = await prisma.generatedDocument.findUniqueOrThrow({ where: { id } });
  if (existing.status !== "IN_REVIEW") {
    throw new BusinessRuleError("Only a document currently in review can have revisions requested.");
  }

  const updated = await prisma.generatedDocument.update({
    where: { id },
    data: { status: "REVISION_REQUESTED", revisionNote: note, reviewedById: actor.id },
  });
  await logActivity({
    action: "requested revisions on generated document",
    entityType: "GENERATED_DOCUMENT",
    entityId: id,
    matterId: existing.matterId,
    clientId: existing.clientId,
    actorId: actor.id,
    currentValue: note,
    source: "AI_DOCUMENT_GENERATOR",
  });
  revalidatePath("/", "layout");
  return updated;
}

export async function approveGeneratedDocument(id: string) {
  const actor = await requireUser();
  const existing = await prisma.generatedDocument.findUniqueOrThrow({ where: { id } });
  if (existing.status !== "IN_REVIEW") {
    throw new BusinessRuleError("Only a document currently in review can be approved.");
  }

  const updated = await prisma.generatedDocument.update({
    where: { id },
    data: { status: "APPROVED", approvedById: actor.id },
  });
  await logActivity({
    action: "approved generated document",
    entityType: "GENERATED_DOCUMENT",
    entityId: id,
    matterId: existing.matterId,
    clientId: existing.clientId,
    actorId: actor.id,
    source: "AI_DOCUMENT_GENERATOR",
  });
  revalidatePath("/", "layout");
  return updated;
}

/** Writes the approved document's content to real storage and creates a real DocumentFile — closing the loop into the Documents module. Only an APPROVED document can be exported. */
export async function exportGeneratedDocument(id: string) {
  const actor = await requireUser();
  const existing = await prisma.generatedDocument.findUniqueOrThrow({ where: { id } });
  if (existing.status !== "APPROVED") {
    throw new BusinessRuleError("Only an approved document can be exported.");
  }

  const storage = getStorageProvider();
  const fileName = `${existing.title.replace(/[^a-zA-Z0-9._-]/g, "_")}.txt`;
  const scope = existing.matterId ? "matters" : existing.clientId ? "clients" : "templates";
  const ownerId = existing.matterId ?? existing.clientId ?? "generated-documents";
  const saved = await storage.save(scope, ownerId, fileName, Buffer.from(existing.content, "utf-8"));

  const documentFile = await prisma.$transaction(async (tx) => {
    const file = await tx.documentFile.create({
      data: {
        name: fileName,
        matterId: existing.matterId,
        clientId: existing.clientId,
        fileType: storage.extensionOf(fileName),
        sizeBytes: Buffer.byteLength(existing.content, "utf-8"),
        storagePath: saved.storagePath,
        status: "FINAL",
        uploadedById: actor.id,
      },
    });
    await tx.generatedDocument.update({ where: { id }, data: { status: "EXPORTED", exportedDocumentId: file.id } });
    return file;
  });

  await logActivity({
    action: "exported generated document to Documents",
    entityType: "GENERATED_DOCUMENT",
    entityId: id,
    matterId: existing.matterId,
    clientId: existing.clientId,
    actorId: actor.id,
    currentValue: documentFile.id,
    source: "AI_DOCUMENT_GENERATOR",
  });

  revalidatePath("/", "layout");
  return documentFile;
}
