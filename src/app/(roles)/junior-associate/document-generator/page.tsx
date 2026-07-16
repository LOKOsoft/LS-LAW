import { PageHeader } from "@/components/shared/page-header";
import { DocumentGeneratorView } from "@/components/document-generator/document-generator-view";
import { getTemplates, getRecentlyUsedTemplates } from "@/features/templates/queries";

export default async function JuniorAssociateDocumentGeneratorPage() {
  const [templates, recent] = await Promise.all([getTemplates(), getRecentlyUsedTemplates()]);

  return (
    <div>
      <PageHeader
        title="Document Generator"
        description="Generate polished documents from the firm's approved template library."
      />
      <DocumentGeneratorView templates={templates} recent={recent} />
    </div>
  );
}
