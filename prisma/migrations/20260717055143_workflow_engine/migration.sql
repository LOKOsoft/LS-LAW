-- CreateTable
CREATE TABLE "DocumentComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentComment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousValue" TEXT,
    "currentValue" TEXT,
    "source" TEXT NOT NULL DEFAULT 'APP',
    "matterId" TEXT,
    "clientId" TEXT,
    "actorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActivityLog" ("action", "actorId", "clientId", "createdAt", "entityId", "entityType", "id", "matterId") SELECT "action", "actorId", "clientId", "createdAt", "entityId", "entityType", "id", "matterId" FROM "ActivityLog";
DROP TABLE "ActivityLog";
ALTER TABLE "new_ActivityLog" RENAME TO "ActivityLog";
CREATE TABLE "new_DocumentFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "folderId" TEXT,
    "matterId" TEXT,
    "clientId" TEXT,
    "fileType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "storagePath" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "uploadedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "approvedById" TEXT,
    "submittedForReviewAt" DATETIME,
    "approvedAt" DATETIME,
    "clientApprovedAt" DATETIME,
    "signedAt" DATETIME,
    "filedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocumentFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "DocumentFolder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DocumentFile_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentFile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DocumentFile_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DocumentFile_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DocumentFile" ("clientId", "createdAt", "fileType", "folderId", "id", "isArchived", "isShared", "matterId", "name", "sizeBytes", "status", "storagePath", "tags", "updatedAt", "uploadedById", "version") SELECT "clientId", "createdAt", "fileType", "folderId", "id", "isArchived", "isShared", "matterId", "name", "sizeBytes", "status", "storagePath", "tags", "updatedAt", "uploadedById", "version" FROM "DocumentFile";
DROP TABLE "DocumentFile";
ALTER TABLE "new_DocumentFile" RENAME TO "DocumentFile";
CREATE TABLE "new_Matter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matterNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "practiceAreaId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INTAKE',
    "stage" TEXT NOT NULL DEFAULT 'MATTER_CREATED',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "billingType" TEXT NOT NULL DEFAULT 'HOURLY',
    "hourlyRate" REAL,
    "estimatedValue" REAL,
    "openedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetCloseDate" DATETIME,
    "closedDate" DATETIME,
    "opposingParty" TEXT,
    "opposingCounsel" TEXT,
    "responsibleAttorneyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Matter_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Matter_practiceAreaId_fkey" FOREIGN KEY ("practiceAreaId") REFERENCES "PracticeArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matter_responsibleAttorneyId_fkey" FOREIGN KEY ("responsibleAttorneyId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Matter" ("billingType", "clientId", "closedDate", "createdAt", "description", "estimatedValue", "hourlyRate", "id", "matterNumber", "openedDate", "opposingCounsel", "opposingParty", "practiceAreaId", "priority", "responsibleAttorneyId", "status", "targetCloseDate", "title", "updatedAt") SELECT "billingType", "clientId", "closedDate", "createdAt", "description", "estimatedValue", "hourlyRate", "id", "matterNumber", "openedDate", "opposingCounsel", "opposingParty", "practiceAreaId", "priority", "responsibleAttorneyId", "status", "targetCloseDate", "title", "updatedAt" FROM "Matter";
DROP TABLE "Matter";
ALTER TABLE "new_Matter" RENAME TO "Matter";
CREATE UNIQUE INDEX "Matter_matterNumber_key" ON "Matter"("matterNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
