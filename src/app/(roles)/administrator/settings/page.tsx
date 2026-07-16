import { PageHeader } from "@/components/shared/page-header";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { getSettingsData } from "@/features/settings/queries";

export default async function SettingsPage() {
  const data = await getSettingsData();

  return (
    <div>
      <PageHeader title="Settings" description="Firm configuration, offices, practice areas, and system preferences." />
      <SettingsTabs data={data} />
    </div>
  );
}
