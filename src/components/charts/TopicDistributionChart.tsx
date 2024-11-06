"use client";
import { studySessionDto } from "@/src/types";

export type TopicDistributionChartProps = {
  studySessions: studySessionDto[];
};
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
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#00E396",
  "#775DD0",
  "#FEB019",
  "#FF66C3",
];

const TopicDistributionChart: React.FC<TopicDistributionChartProps> = ({
  studySessions,
}) => {
  // Aggregate effectiveTimeOfStudy per topic title
  const topicMap: { [title: string]: number } = {};

  studySessions.forEach((session) => {
    session.topics.forEach((topic) => {
      if (topicMap[topic.title]) {
        topicMap[topic.title] += topic.effectiveTimeOfStudy;
      } else {
        topicMap[topic.title] = topic.effectiveTimeOfStudy;
      }
    });
  });

  // Convert the map to an array suitable for Recharts
  const data = Object.keys(topicMap).map((title) => ({
    name: title,
    value: topicMap[title],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TopicDistributionChart;
