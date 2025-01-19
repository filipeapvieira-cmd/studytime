"use client";

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
import { getYAxisUpperBound, formatHSL } from "@/src/lib/charts/utils";

interface BarChartProps {
  chartData:
    | {
        name: string;
        total: number;
      }[]
    | null;
}

const fontSize = 15;

const WeeklyDistributionChart = ({ chartData }: BarChartProps) => {
  if (!chartData) {
    return null;
  }

  return (
    <div className="mt-5">
      <h1 className="text-lg md:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text">
        Weekly
      </h1>
      <ResponsiveContainer height={400} width="100%" className="mt-2">
        <BarChart data={chartData} maxBarSize={300}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            fontSize={fontSize}
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <YAxis
            domain={[0, getYAxisUpperBound(chartData)]}
            tickFormatter={(tick: number) => Math.ceil(tick / 3600).toString()}
            allowDecimals={false}
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

export default WeeklyDistributionChart;

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
