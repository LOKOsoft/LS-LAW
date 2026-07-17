/**
 * Design surface for future multi-tenancy. Today there is exactly one `Firm`
 * row (single-tenant, matching the DB architecture doc) — nothing partitions
 * queries by tenant. This module exists so that if LEXORA is ever sold as a
 * hosted product with many firms sharing one deployment, the swap is
 * "implement `RemoteTenantProvider` + add `firmId` scoping to queries", not
 * "invent a tenant concept from scratch".
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface TenantContext {
  tenant: Tenant;
}

export interface TenantRepository {
  getCurrentTenant(): Promise<Tenant>;
  getTenantById(id: string): Promise<Tenant | null>;
}

/**
 * Firm-level data isolation strategy once multi-tenancy is real. Documented
 * here (not implemented) because the choice affects the Prisma schema:
 *
 * - "shared-schema": add `firmId` to every top-level model (Client, Matter,
 *   User, ...) and filter every query by it — cheapest to run, easiest to
 *   migrate to from today's schema (it already has one implicit firm),
 *   riskiest if a filter is ever forgotten on a new query.
 * - "schema-per-tenant": one Postgres schema per firm — stronger isolation,
 *   much more migration/ops overhead, overkill for a firm-sized SaaS tenant.
 * - "db-per-tenant": one SQLite/Postgres database per firm — matches today's
 *   "one file per install" mental model most closely, but doesn't scale to
 *   cross-tenant reporting/admin without a fan-out query layer.
 *
 * Recommendation when this becomes real: shared-schema with `firmId`, since
 * every model already hangs off implicit firm-wide data and the query
 * functions already accept a scoping parameter (`{ scopeUserId }`) — adding
 * `{ scopeFirmId }` next to it is a small, familiar extension, not a new
 * pattern.
 */
export type FirmIsolationStrategy = "shared-schema" | "schema-per-tenant" | "db-per-tenant";

/**
 * What stays global/shared across tenants even after multi-tenancy ships —
 * things like the module registry (`nav.ts`), the permission matrix shape,
 * and reference/lookup data that isn't firm-specific. Kept as a type (not
 * an enum of values) since the actual list lives in code, not config.
 */
export type SharedDataCategory = "module-registry" | "permission-matrix-shape" | "system-templates";
