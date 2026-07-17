"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";

/** Toggles a bookmark on a knowledge/research article for the current user — the "Bookmarking" capability of the Legal Research Assistant (Step 8). */
export async function toggleResearchBookmark(articleId: string) {
  const user = await requireUser();
  const existing = await prisma.researchBookmark.findUnique({
    where: { userId_articleId: { userId: user.id, articleId } },
  });

  if (existing) {
    await prisma.researchBookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.researchBookmark.create({ data: { userId: user.id, articleId } });
  }

  revalidatePath("/", "layout");
  return { bookmarked: !existing };
}

/** Adds a note to the current user's research notebook — optionally attached to an article and/or a matter. */
export async function addResearchNote(input: { body: string; articleId?: string; matterId?: string }) {
  const user = await requireUser();
  const note = await prisma.researchNote.create({
    data: { userId: user.id, body: input.body, articleId: input.articleId ?? null, matterId: input.matterId ?? null },
  });
  revalidatePath("/", "layout");
  return note;
}

export async function deleteResearchNote(noteId: string) {
  const user = await requireUser();
  await prisma.researchNote.deleteMany({ where: { id: noteId, userId: user.id } });
  revalidatePath("/", "layout");
}
