"use client";

import { newEntry } from "@/utils/api";
import { useRouter } from "next/navigation";
//new entry component
const NewEntry = () => {
  const router = useRouter();
//on click action
  const handleOnClick = async () => {
    //create a new entry, route to another page, and refresh from server
    const { data } = await newEntry();
    router.push(`/journal/${data.id}`);
    router.refresh();
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={handleOnClick}>
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  );
};

export default NewEntry;
