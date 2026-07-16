import { PageHeader } from "@/components/shared/page-header";
import { DocumentsExplorer } from "@/components/documents/documents-explorer";
import { getDocuments } from "@/features/documents/queries";

export default async function AccountsDocumentsPage() {
  const documents = await getDocuments();

  return (
    <div>
      <PageHeader title="Documents" description="Billing and financial documents across the firm's vault." />
      <DocumentsExplorer documents={documents} />
    </div>
  );
}
