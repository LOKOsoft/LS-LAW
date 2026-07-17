export type { Tenant, TenantContext, TenantRepository, FirmIsolationStrategy, SharedDataCategory } from "@/lib/platform/tenancy/types";
export { LocalTenantProvider, tenantProvider } from "@/lib/platform/tenancy/local-tenant-provider";
export { resolveTenantFromRequest } from "@/lib/platform/tenancy/middleware-placeholder";
