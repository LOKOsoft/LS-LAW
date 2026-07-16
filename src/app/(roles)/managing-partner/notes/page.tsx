import { PageHeader } from "@/components/shared/page-header";
import { NotesList } from "@/components/notes/notes-list";
import { getNotesList } from "@/features/notes/queries";

export default async function NotesPage() {
  const notes = await getNotesList();

  return (
    <div>
      <PageHeader title="Notes" description="Internal notes across matters and clients, firm-wide." />
      <NotesList notes={notes} />
    </div>
  );
}
