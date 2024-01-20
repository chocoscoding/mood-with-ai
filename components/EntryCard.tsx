import { Analysis, JournalEntry } from "@prisma/client";

//one entry card
const EntryCard = (props: JournalEntry & { Analysis: Analysis | null }) => {
  const date = new Date(props.createdAt).toDateString();
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{date}</div>
      <div className="px-4 py-5 sm:p-6">{props.Analysis ? props.Analysis.summary : "Add more context to your journal"}</div>
      <div className="px-4 py-4 sm:px-6">{props.Analysis ? props.Analysis.mood : "Add more context to your journal"}</div>
    </div>
  );
};

export default EntryCard;
