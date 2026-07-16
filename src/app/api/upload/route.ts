import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { saveFileToStorage, extensionOf } from "@/lib/storage/local-storage";
import { getManagingPartner } from "@/features/firm/queries";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const matterId = formData.get("matterId");
  const clientId = formData.get("clientId");
  const tags = formData.get("tags");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const owner = typeof matterId === "string" && matterId ? matterId : "unfiled";
  const scope = typeof matterId === "string" && matterId ? "matters" : "clients";
  const bytes = Buffer.from(await file.arrayBuffer());
  const { storagePath } = await saveFileToStorage(scope, owner, file.name, bytes);

  const uploader = await getManagingPartner();

  const document = await prisma.documentFile.create({
    data: {
      name: file.name,
      matterId: typeof matterId === "string" && matterId ? matterId : null,
      clientId: typeof clientId === "string" && clientId ? clientId : null,
      fileType: extensionOf(file.name),
      sizeBytes: bytes.byteLength,
      storagePath,
      tags: typeof tags === "string" ? tags : null,
      uploadedById: uploader.id,
    },
  });

  if (typeof matterId === "string" && matterId) {
    await prisma.activityLog.create({
      data: {
        action: "uploaded a document to",
        entityType: "DOCUMENT",
        entityId: document.id,
        matterId,
        actorId: uploader.id,
      },
    });
  }

  return NextResponse.json({ document }, { status: 201 });
}
