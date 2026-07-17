import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Provisions an isolated, throwaway SQLite database for one integration test
 * file — pushes the real `prisma/schema.prisma` onto a temp file (no
 * migration history needed, `prisma db push` is enough for a scratch DB) and
 * points `DATABASE_FILE_PATH` at it before any test imports `@/lib/db/prisma`.
 *
 * Callers must set up the env var in a top-level `beforeAll` (before
 * importing anything under `@/lib` or `@/features`) since the Prisma
 * singleton reads the path once at module load.
 */
export function provisionTestDatabase(testName: string): { dbPath: string; cleanup: () => void } {
  const dbPath = path.join(process.cwd(), "tests", ".tmp", `${testName}-${Date.now()}.db`);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  execSync("npx prisma db push --accept-data-loss", {
    env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
    stdio: "pipe",
  });

  process.env.DATABASE_FILE_PATH = dbPath;

  return {
    dbPath,
    cleanup: () => {
      fs.rmSync(dbPath, { force: true });
      fs.rmSync(`${dbPath}-journal`, { force: true });
      delete process.env.DATABASE_FILE_PATH;
    },
  };
}
