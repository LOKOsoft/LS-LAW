import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";
import { LoginForm } from "@/components/auth/login-form";
import { getFirm } from "@/features/firm/queries";
import { Scale } from "lucide-react";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(ROLE_HOME[user.role]);
  }
  const firm = await getFirm();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scale className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">LEXORA</p>
            <p className="text-xs text-muted-foreground">{firm.name}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your firm credentials to access your workspace.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
