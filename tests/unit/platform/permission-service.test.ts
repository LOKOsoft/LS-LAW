import { describe, expect, it } from "vitest";
import { Role } from "@/generated/prisma/client";
import { LocalPermissionService } from "@/lib/platform/auth/permission-service";
import type { UserContext } from "@/lib/platform/auth/types";

function userWithRole(role: Role): UserContext {
  return { id: "u1", email: "u1@example.com", name: "Test User", role, clientId: null, firmId: "default" };
}

describe("platform/auth/permission-service", () => {
  const service = new LocalPermissionService();

  it("gives Managing Partner full access to billing", () => {
    expect(service.can(userWithRole(Role.MANAGING_PARTNER), { moduleKey: "billing", action: "full" })).toBe(true);
  });

  it("does not give Junior Associate access to finance", () => {
    expect(service.accessLevel(userWithRole(Role.JUNIOR_ASSOCIATE), "finance")).toBe("—");
  });

  it("gives Reception no access to matters", () => {
    expect(service.can(userWithRole(Role.RECEPTION), { moduleKey: "matters", action: "view" })).toBe(false);
  });

  it("denies Client Portal users any staff-module access", () => {
    expect(service.can(userWithRole(Role.CLIENT), { moduleKey: "dashboard", action: "view" })).toBe(false);
  });
});
