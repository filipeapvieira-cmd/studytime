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
  "#F9FAFB", // light gray-50
  "#E5E7EB", // gray-200
  "#D1D5DB", // gray-300
  "#9CA3AF", // gray-400
  "#6B7280", // gray-500
  "#4B5563", // gray-600
  "#2563EB", // blue-600 (adds contrast)
  "#059669", // green-600 (adds contrast)
  "#D97706", // amber-600 (adds contrast)
  "#1F2937", // gray-800 (dark contrast)
  "#111827", // gray-900 (dark contrast)
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
      <h1 className="text-xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
        Topic Time Distribution
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            dataKey="value"
            data={filteredChartData}
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={100}
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
  //return chartData.filter((item) => item.value >= 3600);
  return chartData;
}
