"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

// Define a color palette
export const COLORS = [
  "#7C3AED", // purple-600
  "#EF4444", // red-500
  "#F59E0B", // yellow-500
  "#2563EB", // blue-600
  "#059669", // green-600
  "#D97706", // amber-600
  "#1F2937", // gray-800
  "#111827", // gray-900
  "#FFFFFF", // white
];

type ChartDataItem = {
  name: string;
  value: number;
};

type TopicDistributionChartProps = {
  chartData: ChartDataItem[];
};

const TopicDistributionChart = ({ chartData }: TopicDistributionChartProps) => {
  const filteredChartData = filterChartData(chartData).map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  const totalTimeStudied = React.useMemo(() => {
    const totalSeconds = chartData.reduce(
      (acc, curr) => acc + curr.value / 1000, // Convert milliseconds to seconds
      0
    );

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [chartData]);

  return (
    <div className="mt-5">
      <h1 className="text-lg md:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text">
        Topic
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            dataKey="value"
            data={filteredChartData}
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={115}
            strokeWidth={1}
            fill="#8884d8"
          >
            {filteredChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalTimeStudied}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Time Studied
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopicDistributionChart;

function filterChartData(chartData: ChartDataItem[]): ChartDataItem[] {
  return chartData.filter((item) => item.value >= 1800);
}
