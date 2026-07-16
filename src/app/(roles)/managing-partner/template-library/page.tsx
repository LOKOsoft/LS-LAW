import { PageHeader } from "@/components/shared/page-header";
import { TemplatesTable } from "@/components/templates/templates-table";
import { getTemplates } from "@/features/templates/queries";

export default async function TemplateLibraryPage() {
  const templates = await getTemplates();

  return (
    <div>
      <PageHeader title="Template Library" description="Browse and manage the firm's reusable document templates." />
      <TemplatesTable templates={templates} />
    </div>
  );
}
