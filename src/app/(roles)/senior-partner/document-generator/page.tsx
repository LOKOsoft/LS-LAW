import { PageHeader } from "@/components/shared/page-header";
import { DocumentGeneratorView } from "@/components/document-generator/document-generator-view";
import { getTemplates, getRecentlyUsedTemplates } from "@/features/templates/queries";
import { getGeneratedDocuments } from "@/features/document-generator/queries";
import { getMatterOptions } from "@/features/matters/queries";
import { prisma } from "@/lib/db/prisma";

export default async function SeniorPartnerDocumentGeneratorPage() {
  const [templates, recent, generatedDocuments, matterOptions, clients] = await Promise.all([
    getTemplates(),
    getRecentlyUsedTemplates(),
    getGeneratedDocuments(),
    getMatterOptions(),
    prisma.client.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Document Generator"
        description="Generate polished documents from the firm's approved template library."
      />
      <DocumentGeneratorView
        templates={templates}
        recent={recent}
        generatedDocuments={generatedDocuments}
        matters={matterOptions.map((m) => ({ id: m.id, label: m.title }))}
        clients={clients.map((c) => ({ id: c.id, label: c.name }))}
      />
    </div>
  );
}
