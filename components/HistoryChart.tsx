"use client";

import { Analysis } from "@prisma/client";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

const CustomTooltip = ({ payload, label, active }: any) => {
  // Formatting the date label to a readable format
  const dateLabel = new Date(label).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  if (active) {
    const analysis = payload[0]?.payload || [];
    return (
      <div className="p-8 custom-tooltip bg-white/5 shadow-md border border-black/10 rounded-lg backdrop-blur-md relative">
        {/* Displaying a small dot with the analysis color */}
        <div
          className="absolute left-2 top-2 w-2 h-2 rounded-full"
          style={{ background: analysis.color }}></div>
        {/* Displaying the date label */}
        <p className="label text-sm text-black/30">{dateLabel}</p>
        {/* Displaying the mood value */}
        <p className="intro text-xl uppercase">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

// HistoryChart component to render the line chart using the analysis data
const HistoryChart = ({ data }: { data: Analysis[] }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <LineChart
        width={300}
        height={100}
        data={data}>
        {/* Rendering the line chart */}
        <Line
          type="monotone"
          dataKey="sentimentScore"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        {/* Rendering the x-axis */}
        <XAxis dataKey="updatedAt" />
        {/* Rendering the tooltip with the custom content */}
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Exporting the HistoryChart component as the default export
export default HistoryChart;
