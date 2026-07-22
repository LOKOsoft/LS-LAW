"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildNavSections, type ModuleKey } from "@/lib/constants/nav";

type SidebarNavProps = {
  basePath: string;
  allowedKeys: ModuleKey[];
  onNavigate?: () => void;
};

/** Shared nav-section rendering used by both the desktop sidebar (`Sidebar`) and the mobile off-canvas nav (`Topbar`'s `Sheet`), so the two never drift out of sync. */
export function SidebarNav({ basePath, allowedKeys, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const navSections = buildNavSections(basePath, allowedKeys);

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navSections.map((section) => (
        <div key={section.label} className="space-y-1">
          <p className="px-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{section.label}</p>
          {section.items.map((item) => {
            const isActive =
              item.href === basePath ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
