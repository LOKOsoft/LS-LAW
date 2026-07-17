"use client";

import * as React from "react";

type UseTableFiltersOptions<T> = {
  /** Returns true if `item` matches the lowercased, trimmed search query. */
  search: (item: T, query: string) => boolean;
  /** Returns true if `item` matches the current filter value. Omit if the table has no secondary filter. */
  filter?: (item: T, value: string) => boolean;
  initialFilterValue?: string;
};

/**
 * Extracts the search + single equality-filter pattern duplicated across
 * clients/matters/hearings/audit-logs/clauses/hr/knowledge-base/templates tables.
 */
export function useTableFilters<T>(items: T[], options: UseTableFiltersOptions<T>) {
  const { search: searchMatch, filter: filterMatch, initialFilterValue = "ALL" } = options;
  const [search, setSearch] = React.useState("");
  const [filterValue, setFilterValue] = React.useState(initialFilterValue);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = query.length === 0 || searchMatch(item, query);
      const matchesFilter =
        filterValue === initialFilterValue || !filterMatch || filterMatch(item, filterValue);
      return matchesSearch && matchesFilter;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchMatch/filterMatch are expected to be stable per-render closures, not memoized by callers
  }, [items, search, filterValue, initialFilterValue]);

  return { search, setSearch, filterValue, setFilterValue, filtered };
}
