import Link from "next/link";
import { Scale, ArrowRight, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleRoutes } from "@/lib/constants/nav";

export function RoleComingSoon({ role }: { role: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-16 text-center">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Scale className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">LEXORA</span>
      </div>

      <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card px-8 py-10 shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Construction className="size-6 text-muted-foreground" />
        </div>
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{role} workspace</p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Coming in a future phase</h1>
        <p className="text-sm text-muted-foreground">
          LEXORA routes every role to its own URL with no login required. Phase 1 ships the Managing Partner
          dashboard first — the {role.toLowerCase()} workspace will be built out next.
        </p>
        <Button asChild className="mt-2">
          <Link href="/managing-partner">
            Go to Managing Partner dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {roleRoutes.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
