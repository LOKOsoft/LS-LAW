-- CreateIndex
CREATE INDEX "ActivityLog_matterId_idx" ON "ActivityLog"("matterId");

-- CreateIndex
CREATE INDEX "ActivityLog_clientId_idx" ON "ActivityLog"("clientId");

-- CreateIndex
CREATE INDEX "ActivityLog_actorId_idx" ON "ActivityLog"("actorId");

-- CreateIndex
CREATE INDEX "Client_relationshipManagerId_idx" ON "Client"("relationshipManagerId");

-- CreateIndex
CREATE INDEX "CommunicationLog_matterId_idx" ON "CommunicationLog"("matterId");

-- CreateIndex
CREATE INDEX "CommunicationLog_clientId_idx" ON "CommunicationLog"("clientId");

-- CreateIndex
CREATE INDEX "Company_clientId_idx" ON "Company"("clientId");

-- CreateIndex
CREATE INDEX "Contact_companyId_idx" ON "Contact"("companyId");

-- CreateIndex
CREATE INDEX "Contact_clientId_idx" ON "Contact"("clientId");

-- CreateIndex
CREATE INDEX "DocumentComment_documentId_idx" ON "DocumentComment"("documentId");

-- CreateIndex
CREATE INDEX "DocumentFile_folderId_idx" ON "DocumentFile"("folderId");

-- CreateIndex
CREATE INDEX "DocumentFile_matterId_idx" ON "DocumentFile"("matterId");

-- CreateIndex
CREATE INDEX "DocumentFile_clientId_idx" ON "DocumentFile"("clientId");

-- CreateIndex
CREATE INDEX "DocumentFolder_parentId_idx" ON "DocumentFolder"("parentId");

-- CreateIndex
CREATE INDEX "DocumentFolder_matterId_idx" ON "DocumentFolder"("matterId");

-- CreateIndex
CREATE INDEX "DocumentFolder_clientId_idx" ON "DocumentFolder"("clientId");

-- CreateIndex
CREATE INDEX "DocumentVersion_documentId_idx" ON "DocumentVersion"("documentId");

-- CreateIndex
CREATE INDEX "Expense_matterId_idx" ON "Expense"("matterId");

-- CreateIndex
CREATE INDEX "Expense_clientId_idx" ON "Expense"("clientId");

-- CreateIndex
CREATE INDEX "GeneratedDocument_matterId_idx" ON "GeneratedDocument"("matterId");

-- CreateIndex
CREATE INDEX "GeneratedDocument_clientId_idx" ON "GeneratedDocument"("clientId");

-- CreateIndex
CREATE INDEX "GeneratedDocumentVersion_generatedDocumentId_idx" ON "GeneratedDocumentVersion"("generatedDocumentId");

-- CreateIndex
CREATE INDEX "Hearing_matterId_idx" ON "Hearing"("matterId");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE INDEX "Invoice_matterId_idx" ON "Invoice"("matterId");

-- CreateIndex
CREATE INDEX "InvoiceLineItem_invoiceId_idx" ON "InvoiceLineItem"("invoiceId");

-- CreateIndex
CREATE INDEX "LeaveRequest_userId_idx" ON "LeaveRequest"("userId");

-- CreateIndex
CREATE INDEX "Matter_clientId_idx" ON "Matter"("clientId");

-- CreateIndex
CREATE INDEX "Matter_practiceAreaId_idx" ON "Matter"("practiceAreaId");

-- CreateIndex
CREATE INDEX "Matter_responsibleAttorneyId_idx" ON "Matter"("responsibleAttorneyId");

-- CreateIndex
CREATE INDEX "MatterTeamMember_userId_idx" ON "MatterTeamMember"("userId");

-- CreateIndex
CREATE INDEX "Meeting_matterId_idx" ON "Meeting"("matterId");

-- CreateIndex
CREATE INDEX "Meeting_clientId_idx" ON "Meeting"("clientId");

-- CreateIndex
CREATE INDEX "Note_matterId_idx" ON "Note"("matterId");

-- CreateIndex
CREATE INDEX "Note_clientId_idx" ON "Note"("clientId");

-- CreateIndex
CREATE INDEX "Notification_matterId_idx" ON "Notification"("matterId");

-- CreateIndex
CREATE INDEX "Office_firmId_idx" ON "Office"("firmId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_clientId_idx" ON "Payment"("clientId");

-- CreateIndex
CREATE INDEX "ResearchNote_userId_idx" ON "ResearchNote"("userId");

-- CreateIndex
CREATE INDEX "ResearchNote_articleId_idx" ON "ResearchNote"("articleId");

-- CreateIndex
CREATE INDEX "ResearchNote_matterId_idx" ON "ResearchNote"("matterId");

-- CreateIndex
CREATE INDEX "Retainer_clientId_idx" ON "Retainer"("clientId");

-- CreateIndex
CREATE INDEX "Retainer_matterId_idx" ON "Retainer"("matterId");

-- CreateIndex
CREATE INDEX "Task_matterId_idx" ON "Task"("matterId");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "TimeEntry_matterId_idx" ON "TimeEntry"("matterId");

-- CreateIndex
CREATE INDEX "TimeEntry_userId_idx" ON "TimeEntry"("userId");

-- CreateIndex
CREATE INDEX "User_officeId_idx" ON "User"("officeId");

-- CreateIndex
CREATE INDEX "User_clientId_idx" ON "User"("clientId");
