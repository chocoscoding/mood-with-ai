import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const user = await getUserByClerkId({});
  try {
    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: body.content,
      },
    });
    return NextResponse.json({ data: entry });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.error();
  }
};
