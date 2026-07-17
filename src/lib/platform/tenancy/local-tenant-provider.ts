import { prisma } from "@/lib/db/prisma";
import type { Tenant, TenantRepository } from "@/lib/platform/tenancy/types";

function toTenant(firm: { id: string; name: string }): Tenant {
  return { id: firm.id, name: firm.name, slug: "default", isActive: true };
}

/** Single-tenant implementation — resolves "the current tenant" to the one `Firm` row that exists today. Real multi-tenancy would replace this with a provider that resolves tenant from subdomain/header/session instead of always querying `findFirst()`. */
export class LocalTenantProvider implements TenantRepository {
  async getCurrentTenant(): Promise<Tenant> {
    const firm = await prisma.firm.findFirst();
    if (!firm) {
      throw new Error("No Firm row exists — run `npm run db:seed` before resolving a tenant.");
    }
    return toTenant(firm);
  }

  async getTenantById(id: string): Promise<Tenant | null> {
    const firm = await prisma.firm.findUnique({ where: { id } });
    return firm ? toTenant(firm) : null;
  }
}

export const tenantProvider: TenantRepository = new LocalTenantProvider();
