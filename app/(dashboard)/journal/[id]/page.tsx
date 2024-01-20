import Entry from "@/components/Entry";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntry = async (id: string) => {
  // Retrieve the user associated with the clerk ID
  const user = await getUserByClerkId({});

  // Retrieve the journal entry using the user's ID and the provided entry ID
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user!.id,
        id,
      },
    },
    // Include analysis data for the entry
    include: {
      Analysis: {
        select: {
          mood: true,
          subject: true,
          summary: true,
          negative: true,
          color: true,
        },
      },
    },
  });

  return entry;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry = await getEntry(params.id);

  // If the entry wasn't found, display a message
  if (!entry) return;

  // Otherwise, render the Entry component
  return (
    <div className="w-full h-full">
      <Entry entry={entry} />
    </div>
  );
};
export default EntryPage;
