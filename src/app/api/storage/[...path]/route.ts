import path from "node:path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { STORAGE_ROOT } from "@/lib/storage/local-storage";
import { getSessionUser } from "@/lib/auth/session";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { path: segments } = await params;
  const relativePath = segments.join("/");
  const absolutePath = path.join(STORAGE_ROOT, relativePath);

  if (!absolutePath.startsWith(STORAGE_ROOT)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const file = await fs.readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(absolutePath)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
