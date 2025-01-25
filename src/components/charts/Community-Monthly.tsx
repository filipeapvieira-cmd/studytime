"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CommunityDataStructure } from "@/src/types/charts";

const chartConfig = {
  user: {
    label: "You",
    color: "hsl(var(--chart-1))",
  },
  community: {
    label: "Your Colleagues",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type CommunityMonthlyDistributionChartProps = {
  data: CommunityDataStructure;
};

export function CommunityMonthlyDistributionChart({
  data,
}: CommunityMonthlyDistributionChartProps) {
  const { academicYearData } = data;
  const academicYearKeys = React.useMemo(
    () => Object.keys(academicYearData),
    [data]
  );
  const lastAcademicYear = academicYearKeys[academicYearKeys.length - 1];

  const [selectedYear, setSelectedYear] = React.useState(lastAcademicYear);

  const chartData = React.useMemo(() => {
    if (!selectedYear || !academicYearData[selectedYear]) {
      return [];
    }

    return academicYearData[selectedYear].map((entry) => ({
      month: entry.month,
      user: entry.user,
      community: entry.community,
    }));
  }, [selectedYear, academicYearData]);

  return (
    <Card>
      <CardHeader className="flex-col md:flex-row justify-between mb-6">
        <CardTitle className="text-xl md:text-3xl ">
          <p className="bg-gradient-to-r from-primary to-pink-700 text-transparent bg-clip-text">
            Your Studied Time
          </p>
          <p>Vs.</p>
          <p className="bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text">
            Community Studied Time
          </p>
        </CardTitle>
        <div className="flex gap-x-3 items-center">
          <div className="text-sm text-muted-foreground">Academic Years</div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {academicYearKeys.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="user"
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="user"
              type="monotone"
              stroke="var(--color-user)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="community"
              type="monotone"
              stroke="var(--color-community)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Find out how your study hours compare to others.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
