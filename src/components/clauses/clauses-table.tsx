"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { BookMarked, Star } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toggleClauseFavorite } from "@/features/clauses/actions";
import type { ClauseItem } from "@/features/clauses/queries";

export function ClausesTable({ clauses }: { clauses: ClauseItem[] }) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("ALL");
  const router = useRouter();

  const categories = React.useMemo(() => Array.from(new Set(clauses.map((c) => c.category))), [clauses]);

  const filtered = React.useMemo(() => {
    return clauses.filter((c) => {
      const matchesSearch = search.trim().length === 0 || c.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || c.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [clauses, search, category]);

  async function handleToggle(id: string, next: boolean) {
    try {
      await toggleClauseFavorite(id, next);
      router.refresh();
    } catch {
      toast.error("Could not update favourite");
    }
  }

  const columns: ColumnDef<ClauseItem>[] = [
    {
      accessorKey: "title",
      header: "Clause",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleToggle(row.original.id, !row.original.isFavorite)}>
            <Star className={cn("size-4 text-muted-foreground", row.original.isFavorite && "fill-warning text-warning")} />
          </button>
          <span className="text-sm font-medium text-foreground">{row.original.title}</span>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge> },
    {
      accessorKey: "body",
      header: "Preview",
      cell: ({ row }) => <span className="line-clamp-1 max-w-md text-sm text-muted-foreground">{row.original.body}</span>,
    },
    { accessorKey: "usageCount", header: "Uses", cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original.usageCount}</span> },
  ];

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clauses..."
        filters={
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyIcon={BookMarked}
        emptyTitle="No clauses found"
        emptyDescription="Try adjusting your search or filters."
      />
    </div>
  );
}
