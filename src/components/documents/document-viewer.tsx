"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FileText } from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const IMAGE_TYPES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);

type DocumentViewerProps = {
  fileUrl: string;
  fileType: string;
  fileName: string;
};

/** Real inline preview: PDFs render via pdf.js, images via <img>, everything else falls back to "no preview". */
export function DocumentViewer({ fileUrl, fileType, fileName }: DocumentViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const normalizedType = fileType.toLowerCase().replace(/^\./, "");

  if (normalizedType === "pdf") {
    return (
      <div className="h-[420px] overflow-hidden rounded-lg border border-border">
        <Worker workerUrl="/api/pdf-worker">
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    );
  }

  if (IMAGE_TYPES.has(normalizedType)) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
        {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded file, not a build-time known asset */}
        <img src={fileUrl} alt={fileName} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <FileText className="size-10" />
        <p className="text-xs">No inline preview for .{normalizedType} files</p>
      </div>
    </div>
  );
}
