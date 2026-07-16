import { PageHeader } from "@/components/shared/page-header";
import { DocumentsExplorer } from "@/components/documents/documents-explorer";
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog";
import { getDocuments, getDocumentUploadTargets } from "@/features/documents/queries";

export default async function DocumentsPage() {
  const [documents, matters] = await Promise.all([getDocuments(), getDocumentUploadTargets()]);

  return (
    <div>
      <PageHeader
        title="Documents"
        description="The firm's document vault — folders, tags, versions, and local file storage."
        actions={<UploadDocumentDialog matters={matters} />}
      />
      <DocumentsExplorer documents={documents} />
    </div>
  );
}
