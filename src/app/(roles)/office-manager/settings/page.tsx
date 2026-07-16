import { PageHeader } from "@/components/shared/page-header";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { getSettingsData } from "@/features/settings/queries";

export default async function OfficeManagerSettingsPage() {
  const data = await getSettingsData();

  return (
    <div>
      <PageHeader title="Settings" description="Office configuration, court list, and firm structure." />
      <SettingsTabs data={data} />
    </div>
  );
}
