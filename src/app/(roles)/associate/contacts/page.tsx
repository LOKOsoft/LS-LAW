import { PageHeader } from "@/components/shared/page-header";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { getContacts } from "@/features/contacts/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function AssociateContactsPage() {
  const user = await requireUser(Role.ASSOCIATE);
  const contacts = await getContacts({ scopeUserId: user.id });

  return (
    <div>
      <PageHeader title="Contacts" description="People at companies tied to your clients and matters." />
      <ContactsTable contacts={contacts} />
    </div>
  );
}
