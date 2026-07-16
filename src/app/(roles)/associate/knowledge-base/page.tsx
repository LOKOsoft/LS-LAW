import { PageHeader } from "@/components/shared/page-header";
import { KnowledgeBaseTable } from "@/components/knowledge-base/knowledge-base-table";
import { getKnowledgeArticles } from "@/features/knowledge-base/queries";

export default async function AssociateKnowledgeBasePage() {
  const articles = await getKnowledgeArticles();

  return (
    <div>
      <PageHeader title="Knowledge Base" description="Internal know-how, playbooks, and practice notes." />
      <KnowledgeBaseTable articles={articles} />
    </div>
  );
}
