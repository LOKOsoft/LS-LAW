import { PageHeader } from "@/components/shared/page-header";
import { NotesList } from "@/components/notes/notes-list";
import { getNotesList } from "@/features/notes/queries";
import { requireUser } from "@/lib/auth/dal";
import { Role } from "@/generated/prisma/client";

export default async function AssociateNotesPage() {
  const user = await requireUser(Role.ASSOCIATE);
  const notes = await getNotesList({ scopeUserId: user.id });

  return (
    <div>
      <PageHeader title="Notes" description="Internal notes across your matters and clients." />
      <NotesList notes={notes} />
    </div>
  );
}
