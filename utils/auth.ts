import { auth } from "@clerk/nextjs";
import { prisma } from "./db";

export const getUserByClerkId = async ({ include, select }: { include?: {}; select?: {} }) => {
  const { userId } = await auth();
  select;
  include;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
    ...(include ?  {include}  : {}),
    ...(select ?  {select}  : {}),
  });
  return user;
};
