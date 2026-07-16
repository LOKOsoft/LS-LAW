"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { BookOpen, Eye } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";
import type { KnowledgeArticleItem } from "@/features/knowledge-base/queries";

export function KnowledgeBaseTable({ articles }: { articles: KnowledgeArticleItem[] }) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("ALL");

  const categories = React.useMemo(() => Array.from(new Set(articles.map((a) => a.category))), [articles]);

  const filtered = React.useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch = search.trim().length === 0 || a.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || a.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [articles, search, category]);

  const columns: ColumnDef<KnowledgeArticleItem>[] = [
    {
      accessorKey: "title",
      header: "Article",
      cell: ({ row }) => (
        <div className="min-w-0 max-w-md">
          <p className="truncate text-sm font-medium text-foreground">{row.original.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.summary}</p>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge> },
    { accessorKey: "author.name", header: "Author", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.author.name}</span> },
    {
      accessorKey: "viewCount",
      header: "Views",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
          <Eye className="size-3.5" /> {formatNumber(row.original.viewCount)}
        </span>
      ),
    },
    { accessorKey: "publishedAt", header: "Published", cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.publishedAt)}</span> },
  ];

  return (
    <div>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search knowledge base..."
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
        emptyIcon={BookOpen}
        emptyTitle="No articles found"
        emptyDescription="Try adjusting your search or filters."
      />
    </div>
  );
}
