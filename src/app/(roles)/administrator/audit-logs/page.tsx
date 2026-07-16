import { PageHeader } from "@/components/shared/page-header";
import { AuditLogsTable } from "@/components/audit-logs/audit-logs-table";
import { getAuditLogs } from "@/features/audit-logs/queries";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div>
      <PageHeader title="Audit Logs" description="Compliance-grade trail of every mutating action across the firm." />
      <AuditLogsTable logs={logs} />
    </div>
  );
}
