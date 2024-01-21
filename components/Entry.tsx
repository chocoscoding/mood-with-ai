"use client";
import { deleteEntry, updateEntry } from "@/utils/api";
import { Analysis, JournalEntry } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAutosave } from "react-autosave";
import LoadingState from "./LoadingState";
type AnalysisType = Pick<Analysis, "mood" | "color" | "negative" | "summary" | "subject">;

type CombinedType = JournalEntry & { Analysis: AnalysisType | null };
const Entry = ({ entry }: { entry: CombinedType }) => {
  const [value, setValue] = useState(entry.content);
  const [processState, setProcessState] = useState<"loading" | "deleting" | "idle">("idle");
  const [analysisState, setAnalysisState] = useState(entry.Analysis);

  const rerendercount = useRef(0);
  const router = useRouter();

  //analysis array
  const analysisData = [
    { name: "Summary", value: analysisState?.summary },
    { name: "Subject", value: analysisState?.subject },
    { name: "Mood", value: analysisState?.mood },
    { name: "Negative", value: `${analysisState?.negative}` },
  ];

  useAutosave({
    data: value,
    saveOnUnmount: false,
    onSave: async (_value) => {
      console.log(_value);
      // if (rerendercount.current < 1) return;
      setProcessState("loading");
      const { Analysis } = await updateEntry({ content: _value, id: entry.id });
      setAnalysisState(Analysis);
      setProcessState("idle");
      router.refresh();
      return;
    },
  });
  useEffect(() => {
    rerendercount.current++;
  }, []);

  const deleteAction = async () => {
    await deleteEntry(entry.id);
    setProcessState("deleting");
    router.push(`/journal`);
    router.refresh();
  };

  function setContrastTextColor(hexColor: string) {
    //from chat gpt
    // Extract RGB components and normalize to [0, 1]
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Use black or white based on brightness
    return brightness > 0.5 ? "#000000" : "#FFFFFF";
  }

  return (
    <div className="w-full h-full grid grid-cols-3">
      {/* editor */}
      <div className="col-span-2">
        <div className="w-full h-full relative">
          <LoadingState state={processState} />
          <textarea
            disabled={processState === "deleting"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-full p-8 text-xl outline-none bg-zinc-50"></textarea>
        </div>
      </div>

      {/* analysis */}
      <div className="border-l border-black/10">
        <div
          className="px-6 py-10"
          style={{ backgroundColor: analysisState?.color }}>
          <h2
            className="text-2xl"
            style={{ color: setContrastTextColor(analysisState!.color) }}>
            Analysis
          </h2>
        </div>
        <ul>
          {analysisData.map((item) => (
            <li
              className="px-2 py-4 border-b border-t border-black/10 flex items-center justify-between gap-4"
              key={item.name}>
              <span className="text-lg font-semibold">{item.name}</span>
              <span>{item.value}</span>
            </li>
          ))}
          <button
            className="w-1/2 bg-red-500 text-white rounded-md p-2 cursor-pointer my-2 ml-1"
            onClick={deleteAction}>
            Delete
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Entry;
