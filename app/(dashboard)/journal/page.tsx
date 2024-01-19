import EntryCard from "@/components/EntryCard";
import NewEntry from "@/components/NewEntry";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntries = async () => {
  const user = await getUserByClerkId({});
  //the the user doesn't exist, return nothing
  if (!user) {
    return [];
  }
  //else
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return entries;
};
const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="p-10 bg-zinc-100/50 min-h-full">
      <h2 className="text-3xl mb-8">Journals</h2>
      <div className="grid grid-cols-3 gap-4">
        <NewEntry />
        {entries.map((entry) => (
          <EntryCard
            entry={entry}
            key={entry.id}
          />
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
