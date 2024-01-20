
import HistoryChart from "@/components/HistoryChart";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getData = async () => {
  // Call the getUserByClerkId function and await its response, assigning it to the "user" variable
  const user = await getUserByClerkId({});

  // Use the prisma instance to find all analysis records associated with the user
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user!.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Calculate the total sentiment score by reducing the analyses array and ccl the average
  const total = analyses.reduce((acc, curr) => {
    return acc + curr.sentimentScore;
  }, 0);
  const average = total / analyses.length;

  // Return an object containing the analyses array and the average sentiment score
  return { analyses, average };
};

const HistoryPage = async () => {
  const { analyses, average } = await getData();

  return (
    <div className="h-full px-6 py-8">
      <div>
        <h1 className="text-2xl mb-4">{`Avg. Sentiment: ${average}`}</h1>
      </div>
      <div className="h-full w-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

// Export the HistoryPage component as the default export of this file
export default HistoryPage;