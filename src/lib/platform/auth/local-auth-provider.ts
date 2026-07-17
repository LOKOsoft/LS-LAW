import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import type { AuthProvider, SessionContext, UserContext } from "@/lib/platform/auth/types";

const SINGLE_FIRM_ID = "default";

/**
 * Read-only facade over the real auth stack (`getSessionUser`, DB-backed
 * `Session` rows). Deliberately does NOT redirect on missing auth the way
 * `requireUser()` does — that guard behavior stays in `src/lib/auth/dal.ts`
 * and every role `layout.tsx` that calls it. This provider exists so future
 * code can depend on the `AuthProvider` interface instead of the concrete
 * session module, without changing how login/redirect actually works today.
 */
export class LocalAuthProvider implements AuthProvider {
  async getCurrentUser(): Promise<UserContext | null> {
    const user = await getSessionUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId ?? null,
      firmId: SINGLE_FIRM_ID,
    };
  }

  async getSession(): Promise<SessionContext | null> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.expiresAt < new Date()) return null;

    return { id: session.id, userId: session.userId, expiresAt: session.expiresAt };
  }
}
