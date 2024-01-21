import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  //check for logged in user
  const user = await currentUser();
  //check if user exists in db
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  });

  // if user doesn't create a new user relation
  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
      },
    });
  }
  redirect("/journal");
};
const NewUser = async () => {
  await createNewUser();
  return (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-white">Setting up your account...</p>
    </div>
  );
};

export default NewUser;
