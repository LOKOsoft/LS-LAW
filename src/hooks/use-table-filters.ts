"use client";

import * as React from "react";

type UseTableFiltersOptions<T> = {
  /** Returns true if `item` matches the lowercased, trimmed search query. */
  search: (item: T, query: string) => boolean;
  /** Returns true if `item` matches the current filter value. Omit if the table has no secondary filter. */
  filter?: (item: T, value: string) => boolean;
  initialFilterValue?: string;
  /** Additional named filter dimensions (status, priority, practice area, lawyer, court, amount range, ...) applied alongside `filter`. */
  filters?: Record<string, (item: T, value: string) => boolean>;
  initialFilterValues?: Record<string, string>;
};

/**
 * Extracts the search + equality-filter pattern duplicated across
 * clients/matters/hearings/audit-logs/clauses/hr/knowledge-base/templates tables.
 * `filter`/`filterValue` is the original single-dimension API; `filters`/`setFilter`
 * layers on any number of additional named filter dimensions.
 */
export function useTableFilters<T>(items: T[], options: UseTableFiltersOptions<T>) {
  const { search: searchMatch, filter: filterMatch, initialFilterValue = "ALL", filters, initialFilterValues } = options;
  const [search, setSearch] = React.useState("");
  const [filterValue, setFilterValue] = React.useState(initialFilterValue);

  const filterKeys = React.useMemo(() => Object.keys(filters ?? {}), [filters]);
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(filterKeys.map((key) => [key, initialFilterValues?.[key] ?? "ALL"])),
  );

  const setFilter = React.useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = query.length === 0 || searchMatch(item, query);
      const matchesLegacyFilter =
        filterValue === initialFilterValue || !filterMatch || filterMatch(item, filterValue);
      const matchesNamedFilters = filterKeys.every((key) => {
        const value = filterValues[key] ?? "ALL";
        return value === "ALL" || !filters?.[key] || filters[key](item, value);
      });
      return matchesSearch && matchesLegacyFilter && matchesNamedFilters;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchMatch/filterMatch/filters are expected to be stable per-render closures, not memoized by callers
  }, [items, search, filterValue, initialFilterValue, filterValues, filterKeys]);

  return { search, setSearch, filterValue, setFilterValue, filters: filterValues, setFilter, filtered };
}
