import { PageHeader } from "@/components/shared/page-header";
import { KnowledgeBaseTable } from "@/components/knowledge-base/knowledge-base-table";
import { getResearchArticles } from "@/features/research/queries";

export default async function LegalResearcherResearchPage() {
  const articles = await getResearchArticles();

  return (
    <div>
      <PageHeader title="Research" description="Case law and precedent research references for the firm." />
      <KnowledgeBaseTable articles={articles} />
    </div>
  );
}
