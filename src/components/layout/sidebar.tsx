import { Scale } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { ModuleKey } from "@/lib/constants/nav";

type SidebarProps = {
  basePath: string;
  allowedKeys: ModuleKey[];
  roleLabel: string;
};

export function Sidebar({ basePath, allowedKeys, roleLabel }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Scale className="size-4.5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">LEXORA</p>
          <p className="text-[11px] text-muted-foreground">Lexora &amp; Associates</p>
        </div>
      </div>

      <SidebarNav basePath={basePath} allowedKeys={allowedKeys} />

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
          <p className="text-xs font-medium text-sidebar-foreground">{roleLabel} view</p>
        </div>
      </div>
    </aside>
  );
}
