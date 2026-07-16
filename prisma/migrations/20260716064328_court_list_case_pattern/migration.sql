-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourtListEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "caseNumberPattern" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CourtListEntry" ("address", "city", "email", "id", "name", "phone", "state", "type") SELECT "address", "city", "email", "id", "name", "phone", "state", "type" FROM "CourtListEntry";
DROP TABLE "CourtListEntry";
ALTER TABLE "new_CourtListEntry" RENAME TO "CourtListEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
