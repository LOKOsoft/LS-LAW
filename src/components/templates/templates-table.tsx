"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { LayoutTemplate, Star } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { toggleTemplateFavorite } from "@/features/templates/actions";
import type { TemplateItem } from "@/features/templates/queries";

export function TemplatesTable({ templates }: { templates: TemplateItem[] }) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("ALL");
  const router = useRouter();

  const categories = React.useMemo(() => Array.from(new Set(templates.map((t) => t.category))), [templates]);

  const filtered = React.useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = search.trim().length === 0 || t.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [templates, search, category]);

  async function handleToggle(id: string, next: boolean) {
    try {
      await toggleTemplateFavorite(id, next);
      router.refresh();
    } catch {
      toast.error("Could not update favourite");
    }
  }

  const columns: ColumnDef<TemplateItem>[] = [
    {
      accessorKey: "name",
      header: "Template",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleToggle(row.original.id, !row.original.isFavorite)}>
            <Star className={cn("size-4 text-muted-foreground", row.original.isFavorite && "fill-warning text-warning")} />
          </button>
          <span className="text-sm font-medium text-foreground">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge variant="outline">{row.original.category.replace(/_/g, " ")}</Badge> },
    { accessorKey: "usageCount", header: "Uses", cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original.usageCount}</span> },
    { accessorKey: "lastUsedAt", header: "Last used", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastUsedAt ? formatDate(row.original.lastUsedAt) : "Never"}</span> },
  ];

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search templates..."
        filters={
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyIcon={LayoutTemplate}
        emptyTitle="No templates found"
        emptyDescription="Try adjusting your search or filters."
      />
    </div>
  );
}
