import { LocalAuthProvider } from "@/lib/platform/auth/local-auth-provider";
import type { AuthProvider } from "@/lib/platform/auth/types";

/** Shared instance — there's only ever one `AuthProvider` selected at a time (no per-request provider switching), so a singleton avoids re-instantiating on every import. */
export const localAuthProvider: AuthProvider = new LocalAuthProvider();
