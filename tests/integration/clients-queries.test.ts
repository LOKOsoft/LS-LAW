import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { provisionTestDatabase } from "./helpers/test-db";

// Provisioning + the module imports below must happen in this order: the Prisma
// singleton (`@/lib/db/prisma`) reads its DB file path once at import time, so
// `DATABASE_FILE_PATH` has to be set (via provisionTestDatabase) before the
// first `import("@/lib/db/prisma")` anywhere in this test file's module graph.
let cleanup: () => void;
let prisma: typeof import("@/lib/db/prisma").prisma;
let getClients: typeof import("@/features/clients/queries").getClients;

beforeAll(async () => {
  ({ cleanup } = provisionTestDatabase("clients-queries"));
  ({ prisma } = await import("@/lib/db/prisma"));
  ({ getClients } = await import("@/features/clients/queries"));
});

afterAll(() => {
  cleanup();
});

describe("features/clients/queries against an isolated test database", () => {
  it("excludes archived clients by default", async () => {
    const firm = await prisma.firm.create({ data: { name: "Test Firm" } });
    await prisma.client.create({
      data: { name: "Active Co", clientNumber: "C-0001", type: "COMPANY", status: "ACTIVE" },
    });
    await prisma.client.create({
      data: { name: "Archived Co", clientNumber: "C-0002", type: "COMPANY", status: "ARCHIVED" },
    });

    const clients = await getClients();

    expect(clients.map((c) => c.name)).toContain("Active Co");
    expect(clients.map((c) => c.name)).not.toContain("Archived Co");
    expect(firm.name).toBe("Test Firm"); // sanity check the schema push actually applied
  });
});
