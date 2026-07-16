import Link from "next/link";
import { UserPlus, Briefcase, ListChecks, Receipt, Gavel, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ModuleKey } from "@/lib/constants/nav";

const ALL_ACTIONS: { label: string; icon: typeof UserPlus; key: ModuleKey; path: string }[] = [
  { label: "New Client", icon: UserPlus, key: "clients", path: "clients?new=1" },
  { label: "New Matter", icon: Briefcase, key: "matters", path: "matters?new=1" },
  { label: "New Task", icon: ListChecks, key: "tasks", path: "tasks?new=1" },
  { label: "New Invoice", icon: Receipt, key: "billing", path: "billing?new=1" },
  { label: "Schedule Hearing", icon: Gavel, key: "hearings", path: "hearings?new=1" },
  { label: "Upload Document", icon: UploadCloud, key: "documents", path: "documents?new=1" },
];

export function QuickActionsCard({
  basePath = "/managing-partner",
  allowedKeys = ALL_ACTIONS.map((a) => a.key),
}: {
  basePath?: string;
  allowedKeys?: ModuleKey[];
}) {
  const allowed = new Set(allowedKeys);
  const actions = ALL_ACTIONS.filter((a) => allowed.has(a.key)).map((a) => ({
    label: a.label,
    icon: a.icon,
    href: `${basePath}/${a.path}`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight into a new record</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border px-3 py-4 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <action.icon className="size-4.5" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
