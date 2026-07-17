"use client";

import * as React from "react";
import { FolderOpen } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { documentColumns } from "@/features/documents/columns";
import { DocumentPreviewDrawer } from "@/components/documents/document-preview-drawer";
import type { DocumentListItem } from "@/features/documents/queries";

type QuickFilter = "all" | "recent" | "shared" | "archived";

export function DocumentsExplorer({ documents }: { documents: DocumentListItem[] }) {
  const [search, setSearch] = React.useState("");
  const [fileType, setFileType] = React.useState("ALL");
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("all");
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const fileTypes = React.useMemo(() => Array.from(new Set(documents.map((d) => d.fileType))), [documents]);

  const filtered = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/purity -- "recent" is inherently relative to the current time.
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return documents.filter((d) => {
      const matchesSearch =
        search.trim().length === 0 ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.tags ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesType = fileType === "ALL" || d.fileType === fileType;
      const matchesQuick =
        quickFilter === "all"
          ? !d.isArchived
          : quickFilter === "recent"
            ? new Date(d.createdAt).getTime() >= sevenDaysAgo && !d.isArchived
            : quickFilter === "shared"
              ? d.isShared
              : d.isArchived;
      return matchesSearch && matchesType && matchesQuick;
    });
  }, [documents, search, fileType, quickFilter]);

  return (
    <div className="space-y-3">
      <Tabs value={quickFilter} onValueChange={(v) => setQuickFilter(v as QuickFilter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="archived">Archive</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search documents by name or tag..."
        filters={
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-36" aria-label="Filter by file type">
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {fileTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        columns={documentColumns}
        data={filtered}
        emptyIcon={FolderOpen}
        emptyTitle="No documents found"
        emptyDescription="Try adjusting your search or filters, or upload a new document."
        onRowClick={(doc) => {
          setSelectedDoc(doc);
          setDrawerOpen(true);
        }}
      />

      <DocumentPreviewDrawer document={selectedDoc} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
