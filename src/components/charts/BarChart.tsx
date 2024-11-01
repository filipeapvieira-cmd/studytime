"use client";

import { FC, useEffect, useState } from "react";
import { studySessionDto } from "@/src/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  getTotalStudiedTimePerDayOfTheWeek,
  getYAxisUpperBound,
  formatHSL,
} from "@/src/lib/charts/utils";
interface BarChartProps {
  studySessions: studySessionDto[];
}

const BarChartCustom: FC<BarChartProps> = ({ studySessions }) => {
  const [chartData, setChartData] = useState<
    { name: string; total: number }[] | null
  >(null);
  const fontSize = 15;

  useEffect(() => {
    setChartData(getTotalStudiedTimePerDayOfTheWeek(studySessions));
  }, [studySessions]);

  return (
    <div className="mt-4">
      <ResponsiveContainer height={400} width="100%" className={`mt-2`}>
        <BarChart width={500} data={chartData || []} maxBarSize={300}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            fontSize={fontSize}
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <YAxis
            domain={[0, getYAxisUpperBound(chartData)]}
            tickFormatter={(tick) => (tick / 3600).toFixed(1)}
            label={{
              value: "Hours",
              angle: -90,
              position: "insideLeft",
              fontSize,
            }}
          />
          <Legend />
          <Bar
            dataKey="total"
            fill="hsl(var(--primary))"
            barSize={25}
            radius={[10, 10, 0, 0]}
          >
            <LabelList
              dataKey="total"
              position="top"
              content={<CustomLabel />}
              fill="hsl(var(--primary))"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCustom;

const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  // Fetch the color from the root CSS variables
  const rootStyle = getComputedStyle(document.documentElement);
  const foregroundColor = rootStyle
    .getPropertyValue("--secondary-foreground")
    .trim();
  // Convert it to a proper HSL string
  const formattedForegroundColor = formatHSL(foregroundColor);

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <text
      x={x + 13} // Shift the x position 13 units to the right
      y={y}
      dy={-4}
      fontSize={14}
      textAnchor="middle"
      fill={formattedForegroundColor}
    >
      {formattedTime}
    </text>
  );
};
