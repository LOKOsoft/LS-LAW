"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FileText, FileSpreadsheet, FileType } from "lucide-react";
import { DocumentStatusPill } from "@/components/shared/status-pill";
import { formatBytes, formatDate } from "@/lib/format";
import type { DocumentListItem } from "@/features/documents/queries";

const iconByType: Record<string, typeof FileText> = {
  PDF: FileText,
  DOCX: FileType,
  XLSX: FileSpreadsheet,
};

export const documentColumns: ColumnDef<DocumentListItem>[] = [
  {
    accessorKey: "name",
    header: "Document",
    cell: ({ row }) => {
      const Icon = iconByType[row.original.fileType] ?? FileText;
      return (
        <div className="flex min-w-0 max-w-xs items-center gap-3">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.matter?.title ?? row.original.client?.name ?? "Unfiled"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "fileType",
    header: "Type",
    cell: ({ row }) => <span className="text-xs font-medium text-muted-foreground">{row.original.fileType}</span>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <span className="truncate text-xs text-muted-foreground">{row.original.tags?.split(",").join(" · ") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "uploadedBy.name",
    header: "Uploaded by",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.uploadedBy.name}</span>,
  },
  {
    accessorKey: "sizeBytes",
    header: "Size",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatBytes(row.original.sizeBytes)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <DocumentStatusPill status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Uploaded",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
  },
];
