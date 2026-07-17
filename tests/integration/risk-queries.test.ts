import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { provisionTestDatabase } from "./helpers/test-db";

// See tests/integration/clients-queries.test.ts for why these are dynamic
// imports rather than static ones — the Prisma singleton reads its DB path
// once at module load, so it has to happen after provisionTestDatabase().
let cleanup: () => void;
let prisma: typeof import("@/lib/db/prisma").prisma;
let getMatterRisks: typeof import("@/features/risk/queries").getMatterRisks;

beforeAll(async () => {
  ({ cleanup } = provisionTestDatabase("risk-queries"));
  ({ prisma } = await import("@/lib/db/prisma"));
  ({ getMatterRisks } = await import("@/features/risk/queries"));
});

afterAll(() => {
  cleanup();
});

describe("features/risk/queries.getMatterRisks against an isolated test database", () => {
  it("flags an overdue invoice and an overdue hearing on a real matter", async () => {
    const firm = await prisma.firm.create({ data: { name: "Test Firm" } });
    const office = await prisma.office.create({ data: { firmId: firm.id, name: "HQ" } });
    const practiceArea = await prisma.practiceArea.create({ data: { name: "Litigation" } });
    const attorney = await prisma.user.create({
      data: { name: "Attorney One", email: "attorney@test.local", passwordHash: "x", role: "PARTNER", officeId: office.id },
    });
    const client = await prisma.client.create({ data: { name: "Test Client", clientNumber: "C-9001", type: "COMPANY" } });
    const matter = await prisma.matter.create({
      data: {
        matterNumber: "M-9001",
        title: "Overdue Things Matter",
        clientId: client.id,
        practiceAreaId: practiceArea.id,
        responsibleAttorneyId: attorney.id,
        openedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-9001",
        clientId: client.id,
        matterId: matter.id,
        status: "SENT",
        dueDate: yesterday,
        total: 1000,
        amountPaid: 0,
      },
    });
    await prisma.hearing.create({
      data: { matterId: matter.id, courtName: "Test Court", hearingType: "Motion", scheduledAt: yesterday, status: "SCHEDULED" },
    });

    const findings = await getMatterRisks(matter.id);

    expect(findings.some((f) => f.ruleId === "pending-invoice")).toBe(true);
    expect(findings.some((f) => f.ruleId === "overdue-hearing")).toBe(true);
    // Matter has zero documents and was opened 30 days ago — past the 14-day grace period.
    expect(findings.some((f) => f.ruleId === "missing-mandatory-documents")).toBe(true);
  });
});
