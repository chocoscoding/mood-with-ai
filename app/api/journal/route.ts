import { analyze } from "@/utils/ai";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json(); 
  const user = await getUserByClerkId({}); // Call the getUserByClerkId function and assign the returned user to the user variable

  try {
    // Create a new journal entry 
    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id, 
        content: body.content, 
      },
    });
//analyze with ai
    const analyzeData = await analyze(entry.content);

    if (!analyzeData) throw new Error("Ai error"); // Throw an error if analyzeData is falsy
    await prisma.analysis.create({
      // Create a new analysis using the prisma.analysis.create method
      data: {
        entryId: entry.id, 
        userId: user.id, 
        ...analyzeData, 
      },
    });

    revalidatePath("/journal"); 

    return NextResponse.json({ data: entry }); 
  } catch (error: any) {
    console.log(error.message); 
    return NextResponse.error(); 
  }
};
