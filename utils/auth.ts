import { auth } from "@clerk/nextjs";
import { prisma } from "./db";
import { redirect } from "next/navigation";

//get a user using their clerk id
export const getUserByClerkId = async ({ include, select }: { include?: {}; select?: {} }) => {
  try {
    const { userId } = await auth();
    select;
    include;
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userId as string,
      },
      ...(include ? { include } : {}),
      ...(select ? { select } : {}),
    });
    return user;
  } catch (error) {
    redirect("/new-user");
  }
};
