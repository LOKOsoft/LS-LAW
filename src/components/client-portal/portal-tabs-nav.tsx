"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: "/client" },
  { label: "Documents", href: "/client/documents" },
  { label: "Invoices", href: "/client/invoices" },
  { label: "Messages", href: "/client/messages" },
];

export function PortalTabsNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-5xl gap-1 px-4 sm:px-6">
      {TABS.map((tab) => {
        const isActive = tab.href === "/client" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
