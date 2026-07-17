"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ClientType } from "@/generated/prisma/client";
import {
  createClientSchema,
  createNoteSchema,
  updateClientSchema,
  mergeClientsSchema,
  importClientRowSchema,
  type CreateClientInput,
  type CreateNoteInput,
  type UpdateClientInput,
  type MergeClientsInput,
  type ImportClientRow,
} from "@/features/clients/schema";
import { findSimilarClients } from "@/features/clients/queries";
import { assertClientHasNoActiveMatters } from "@/lib/services/validation";

export async function checkSimilarClientNames(name: string) {
  return findSimilarClients(name);
}

async function nextClientNumber() {
  const count = await prisma.client.count();
  return `CLT-${String(count + 1).padStart(4, "0")}`;
}

export async function createClient(input: CreateClientInput) {
  const data = createClientSchema.parse(input);
  const clientNumber = await nextClientNumber();

  const client = await prisma.client.create({
    data: {
      clientNumber,
      name: data.name,
      type: data.type as ClientType,
      companyName: data.type === "COMPANY" ? data.name : null,
      industry: data.industry || null,
      email: data.email || null,
      phone: data.phone || null,
      city: data.city || null,
      state: data.state || null,
      source: data.source || null,
      relationshipManagerId: data.relationshipManagerId,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "created a new client",
      entityType: "CLIENT",
      entityId: client.id,
      clientId: client.id,
      actorId: data.relationshipManagerId,
    },
  });

  revalidatePath("/", "layout");
  return client;
}

export async function updateClient(clientId: string, input: UpdateClientInput, actorId: string) {
  const data = updateClientSchema.parse(input);

  const client = await prisma.client.update({
    where: { id: clientId },
    data: {
      name: data.name,
      type: data.type as ClientType,
      companyName: data.type === "COMPANY" ? data.name : null,
      industry: data.industry || null,
      email: data.email || null,
      phone: data.phone || null,
      city: data.city || null,
      state: data.state || null,
      source: data.source || null,
      taxId: data.taxId || null,
      addressLine1: data.addressLine1 || null,
      postalCode: data.postalCode || null,
      status: data.status,
      relationshipManagerId: data.relationshipManagerId,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "updated client details",
      entityType: "CLIENT",
      entityId: client.id,
      clientId: client.id,
      actorId,
    },
  });

  revalidatePath("/", "layout");
  return client;
}

export async function reassignRelationshipManager(clientId: string, managerId: string, actorId: string) {
  const client = await prisma.client.update({ where: { id: clientId }, data: { relationshipManagerId: managerId } });

  await prisma.activityLog.create({
    data: {
      action: "reassigned relationship manager",
      entityType: "CLIENT",
      entityId: client.id,
      clientId: client.id,
      actorId,
    },
  });

  revalidatePath("/", "layout");
  return client;
}

export async function archiveClient(clientId: string, actorId: string) {
  await assertClientHasNoActiveMatters(clientId);
  const client = await prisma.client.update({ where: { id: clientId }, data: { status: "ARCHIVED" } });

  await prisma.activityLog.create({
    data: {
      action: "archived client",
      entityType: "CLIENT",
      entityId: client.id,
      clientId: client.id,
      actorId,
    },
  });

  revalidatePath("/", "layout");
  return client;
}

export async function restoreClient(clientId: string, actorId: string) {
  const client = await prisma.client.update({ where: { id: clientId }, data: { status: "ACTIVE" } });

  await prisma.activityLog.create({
    data: {
      action: "restored client from archive",
      entityType: "CLIENT",
      entityId: client.id,
      clientId: client.id,
      actorId,
    },
  });

  revalidatePath("/", "layout");
  return client;
}

export async function mergeClients(input: MergeClientsInput, actorId: string) {
  const { primaryClientId, duplicateClientId } = mergeClientsSchema.parse(input);

  await prisma.$transaction([
    prisma.matter.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.invoice.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.payment.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.documentFolder.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.documentFile.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.note.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.meeting.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.communicationLog.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.retainer.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.expense.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.activityLog.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.company.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.contact.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.user.updateMany({ where: { clientId: duplicateClientId }, data: { clientId: primaryClientId } }),
    prisma.client.update({ where: { id: duplicateClientId }, data: { status: "ARCHIVED" } }),
  ]);

  await prisma.activityLog.create({
    data: {
      action: `merged duplicate client (${duplicateClientId}) into this record`,
      entityType: "CLIENT",
      entityId: primaryClientId,
      clientId: primaryClientId,
      actorId,
    },
  });

  revalidatePath("/", "layout");
  return prisma.client.findUnique({ where: { id: primaryClientId } });
}

export async function bulkImportClients(rows: ImportClientRow[], actorId: string) {
  const parsedRows = rows.map((row) => importClientRowSchema.parse(row));
  let nextNumber = (await prisma.client.count()) + 1;

  const created = [];
  for (const data of parsedRows) {
    const clientNumber = `CLT-${String(nextNumber).padStart(4, "0")}`;
    nextNumber += 1;
    const client = await prisma.client.create({
      data: {
        clientNumber,
        name: data.name,
        type: data.type as ClientType,
        companyName: data.type === "COMPANY" ? data.name : null,
        industry: data.industry || null,
        email: data.email || null,
        phone: data.phone || null,
        city: data.city || null,
        state: data.state || null,
        taxId: data.taxId || null,
        source: "Import",
        relationshipManagerId: data.relationshipManagerId,
      },
    });
    await prisma.activityLog.create({
      data: {
        action: "imported client via bulk import",
        entityType: "CLIENT",
        entityId: client.id,
        clientId: client.id,
        actorId,
      },
    });
    created.push(client);
  }

  revalidatePath("/", "layout");
  return created;
}

export async function createNote(input: CreateNoteInput) {
  const data = createNoteSchema.parse(input);
  const note = await prisma.note.create({
    data: {
      body: data.body,
      clientId: data.clientId || null,
      matterId: data.matterId || null,
      authorId: data.authorId,
    },
  });

  revalidatePath("/", "layout");
  return note;
}
