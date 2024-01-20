// Import the necessary functions and libraries
import { update } from "@/utils/actions";
import { analyze } from "@/utils/ai";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  const { content } = await request.json(); // Get the content from the request body

  // Update the journal entry
  const user = await getUserByClerkId({}); // Retrieve the user using the clerk ID
  const updateEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  });

  // Analyze the updated journal entry using the ai
  const analyzeData = await analyze(updateEntry.content);
  if (!analyzeData) throw new Error("Ai error"); // Throw an error if no analysis data is obtained

  // Upsert the analysis data into the database
  const { entry, mood, summary, subject, negative, color } = await prisma.analysis.upsert({
    where: { entryId: updateEntry.id },
    create: {
      entryId: updateEntry.id,
      userId: user.id,
      ...analyzeData,
    },
    update: analyzeData,
    include: { entry: true },
  });

  return NextResponse.json({ ...entry, Analysis: { mood, summary, subject, negative, color } });
};

export const DELETE = async (request: Request, { params }: {params: {id: string}}) => {
  const user = await getUserByClerkId({});

  await prisma.journalEntry.delete({
    where: {
      userId_id: {
        id: params.id,
        userId: user.id,
      },
    },
  });

  update(["/journal"]);

  return NextResponse.json({ data: { id: params.id } });
};
