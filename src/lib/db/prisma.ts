import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

// Overridable so integration tests (see tests/integration) can point at an isolated
// throwaway database instead of the real dev.db — unset in normal dev/prod, so
// behavior is unchanged from before this override existed.
const dbPath = process.env.DATABASE_FILE_PATH
  ? path.resolve(process.env.DATABASE_FILE_PATH)
  : path.join(process.cwd(), "prisma", "dev.db");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
