import EntryCard from "@/components/EntryCard";
import NewEntry from "@/components/NewEntry";
import Question from "@/components/Question";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import Link from "next/link";

const getEntries = async () => {
  const user = await getUserByClerkId({});
  //the the user doesn't exist, return nothing
  if (!user) {
    return [];
  }
  //else, find all the journal entries for that user
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Analysis: true
    }
  });
  return entries;
};
const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="p-10 bg-zinc-100/50 min-h-full">
      <h2 className="text-3xl mb-8">Journals</h2>
      <div>
        <Question/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* render new entry modal and map through all the entries */}
        <NewEntry />
        {entries.map((entry) => (
          <Link
            href={`/journal/${entry.id}`}
            key={entry.id}>
            <EntryCard {...entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
