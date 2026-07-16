"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ClientType } from "@/generated/prisma/client";
import { createClientSchema, createNoteSchema, type CreateClientInput, type CreateNoteInput } from "@/features/clients/schema";

export async function createClient(input: CreateClientInput) {
  const data = createClientSchema.parse(input);

  const count = await prisma.client.count();
  const clientNumber = `CLT-${String(count + 1).padStart(4, "0")}`;

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
