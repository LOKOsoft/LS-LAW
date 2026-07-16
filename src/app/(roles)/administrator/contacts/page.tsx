import { PageHeader } from "@/components/shared/page-header";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { getContacts } from "@/features/contacts/queries";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <PageHeader title="Contacts" description="Individual people at client organizations, across every company." />
      <ContactsTable contacts={contacts} />
    </div>
  );
}
