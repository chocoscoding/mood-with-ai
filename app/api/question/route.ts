import { qa } from "@/utils/ai";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

// Define a function for the POST request
export const POST = async (request: Request) => {
  // Extract the question from the request body
  const { question } = await request.json();

  // Get the user information based on the clerk ID
  const user = await getUserByClerkId({});

  // Retrieve all journal entries for the user
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  // Use the QA function to generate an answer based on the question and journal entries
  const answer = await qa(question, entries);

  // Trim final answer to where redefined answer ends from
  let startStr = "Refined answer: ";

  let startPos = answer.indexOf(startStr) + startStr.length;

  let refinedAnswer = answer.substring(startPos, answer.length);
  return NextResponse.json({ data: refinedAnswer });
};
