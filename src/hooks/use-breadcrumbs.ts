"use client";

import { usePathname } from "next/navigation";
import { MODULE_LABELS } from "@/lib/constants/nav";

export type Breadcrumb = { label: string; href: string };

/**
 * Derives a breadcrumb trail from the current pathname + the module nav registry,
 * scoped to a role's base path (e.g. "/managing-partner"). Segments that aren't a
 * known module slug (record ids in detail routes) fall back to their raw, decoded value.
 */
export function useBreadcrumbs(basePath: string): Breadcrumb[] {
  const pathname = usePathname();
  const relative = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  const segments = relative.split("/").filter(Boolean);

  const crumbs: Breadcrumb[] = [{ label: "Dashboard", href: basePath }];
  let href = basePath;
  for (const segment of segments) {
    href += `/${segment}`;
    crumbs.push({ label: MODULE_LABELS[segment] ?? decodeURIComponent(segment), href });
  }
  return crumbs;
}
