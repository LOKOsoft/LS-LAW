"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { BookMarked, Star, Copy } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskSeverityPill } from "@/components/shared/status-pill";
import { cn } from "@/lib/utils";
import { toggleClauseFavorite, recordClauseUsage } from "@/features/clauses/actions";
import type { ClauseItem } from "@/features/clauses/queries";
import { useTableFilters } from "@/hooks/use-table-filters";

export function ClausesTable({ clauses }: { clauses: ClauseItem[] }) {
  const router = useRouter();

  const categories = React.useMemo(() => Array.from(new Set(clauses.map((c) => c.category))), [clauses]);

  const { search, setSearch, filterValue: category, setFilterValue: setCategory, filtered } = useTableFilters(clauses, {
    search: (c, q) => c.title.toLowerCase().includes(q),
    filter: (c, value) => c.category === value,
  });

  async function handleToggle(id: string, next: boolean) {
    try {
      await toggleClauseFavorite(id, next);
      router.refresh();
    } catch {
      toast.error("Could not update favourite");
    }
  }

  async function handleUse(clause: ClauseItem) {
    try {
      await navigator.clipboard.writeText(clause.body);
      await recordClauseUsage(clause.id);
      toast.success("Clause copied to clipboard");
      router.refresh();
    } catch {
      toast.error("Could not copy the clause");
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
      accessorKey: "jurisdiction",
      header: "Jurisdiction",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.jurisdiction ?? "—"}</span>,
    },
    { accessorKey: "riskLevel", header: "Risk", cell: ({ row }) => <RiskSeverityPill status={row.original.riskLevel} /> },
    {
      accessorKey: "body",
      header: "Preview",
      cell: ({ row }) => <span className="line-clamp-1 max-w-md text-sm text-muted-foreground">{row.original.body}</span>,
    },
    { accessorKey: "usageCount", header: "Uses", cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original.usageCount}</span> },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => handleUse(row.original)}>
          <Copy className="size-3.5" />
          Use
        </Button>
      ),
    },
  ];

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clauses..."
        filters={
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48" aria-label="Filter by category">
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
