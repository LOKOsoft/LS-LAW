import type { NextRequest } from "next/server";
import { appConfig } from "@/lib/platform/config";

/**
 * Inert tenant-resolution step for `src/proxy.ts`. Not called from `proxy.ts`
 * today — multi-tenancy is off (`appConfig.features.multiTenancy` is false
 * until `LEXORA_MULTI_TENANCY_ENABLED=true`), and there's only one tenant to
 * resolve to anyway. When multi-tenancy ships, this is where subdomain/header
 * based tenant resolution would run before the existing session-cookie
 * check, attaching a tenant id the rest of the request can read (e.g. via a
 * request header, the way the CSP guide's nonce pattern works).
 */
export function resolveTenantFromRequest(request: NextRequest): string | null {
  if (!appConfig.features.multiTenancy) return null;

  // Placeholder resolution order for later: subdomain (acme.lexoralaw.app) → custom
  // domain lookup → `x-tenant-id` header (useful for local testing multi-tenant
  // behavior before real subdomain routing exists).
  const host = request.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];
  return request.headers.get("x-tenant-id") ?? subdomain ?? null;
}
