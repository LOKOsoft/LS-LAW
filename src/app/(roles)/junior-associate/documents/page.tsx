import { PageHeader } from "@/components/shared/page-header";
import { DocumentsExplorer } from "@/components/documents/documents-explorer";
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog";
import { getDocuments, getDocumentUploadTargets } from "@/features/documents/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function JuniorAssociateDocumentsPage() {
  const user = await requireUser(Role.JUNIOR_ASSOCIATE);
  const [documents, matters] = await Promise.all([
    getDocuments({ scopeUserId: user.id }),
    getDocumentUploadTargets({ scopeUserId: user.id }),
  ]);

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Documents on your matters and clients — folders, tags, and versions."
        actions={<UploadDocumentDialog matters={matters} />}
      />
      <DocumentsExplorer documents={documents} />
    </div>
  );
}
