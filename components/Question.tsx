"use client";
import { askQuestion } from "@/utils/api";
import { FormEvent, useState } from "react";

const Question = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  //function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Call the askQuestion function and retrieve the response data
    const { data } = await askQuestion(question);

    // Update the states
    setAnswer(data);
    setLoading(false);
    setQuestion("");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-lg w-full"
          disabled={loading}
          placeholder="Ask a question..."
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-md shrink-0 ml-2">
          Ask
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {answer && <p className="my-4 text-xl">{answer}</p>}
    </div>
  );
};

export default Question;
