"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TemplateCard } from "@/components/templates/template-card";
import type { TemplateItem } from "@/features/templates/queries";

const CATEGORY_LABELS: Record<string, string> = {
  EMPLOYMENT: "Employment",
  CORPORATE: "Corporate",
  LITIGATION: "Litigation",
  PROPERTY: "Property",
  TAX: "Tax",
  COMPLIANCE: "Compliance",
  CONTRACTS: "Contracts",
  NDA: "NDA",
  AGREEMENT: "Agreement",
  NOTICE: "Notice",
  AFFIDAVIT: "Affidavit",
  POWER_OF_ATTORNEY: "Power of Attorney",
  WILL: "Will",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

export function DocumentGeneratorView({ templates, recent }: { templates: TemplateItem[]; recent: TemplateItem[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(
    () => templates.filter((t) => search.trim().length === 0 || t.name.toLowerCase().includes(search.toLowerCase())),
    [templates, search],
  );

  const byCategory = React.useMemo(() => {
    const map = new Map<string, TemplateItem[]>();
    for (const category of CATEGORY_ORDER) map.set(category, []);
    for (const t of filtered) {
      map.get(t.category)?.push(t);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="pl-9" />
      </div>

      {recent.length > 0 && search.trim().length === 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Recently used</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recent.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      ) : null}

      {CATEGORY_ORDER.map((category) => {
        const items = byCategory.get(category) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={category} className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              {CATEGORY_LABELS[category]} <span className="font-normal text-muted-foreground">({items.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
