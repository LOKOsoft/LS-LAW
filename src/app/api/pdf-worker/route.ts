import path from "node:path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";

// Serves the pdf.js worker script from the installed `pdfjs-dist` package so
// react-pdf-viewer always gets a worker build that exactly matches the
// installed API version — no CDN dependency, keeping this app fully local.
const WORKER_PATH = path.join(process.cwd(), "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");

export async function GET() {
  try {
    const file = await fs.readFile(WORKER_PATH);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "text/javascript",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Worker script not found" }, { status: 404 });
  }
}
