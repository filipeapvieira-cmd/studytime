"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const filteredChartData = filterChartData(chartData);
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
            outerRadius={150}
            fill="#8884d8"
          >
            {filteredChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => {
              const hours = Math.floor(value / 3600);
              const minutes = Math.floor((value % 3600) / 60);
              const seconds = value % 60;
              return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopicDistributionChart;

function filterChartData(chartData: ChartDataItem[]): ChartDataItem[] {
  return chartData.filter((item) => item.value >= 3600);
}
