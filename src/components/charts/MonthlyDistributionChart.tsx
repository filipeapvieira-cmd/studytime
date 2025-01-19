"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  AcademicYearData,
  ChartItem,
} from "@/src/lib/charts/monthlyDistributionChart.utils";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const fontSize = 15;

type MonthlyDistributionChartProps = {
  chartData: AcademicYearData;
};

export function MonthlyDistributionChart({
  chartData,
}: MonthlyDistributionChartProps) {
  const academicYearKeys = Object.keys(chartData);

  const transformData = (dataObj: Record<string, number>): ChartItem[] => {
    return Object.entries(dataObj).map(([month, value]) => ({
      name: month,
      total: Math.round(value),
    }));
  };

  const lastAcademicYear = academicYearKeys[academicYearKeys.length - 1];
  const [selectedYear, setSelectedYear] = useState<string>(lastAcademicYear);
  const [data, setData] = useState<ChartItem[]>(
    transformData(chartData[lastAcademicYear])
  );

  if (!chartData) {
    return null;
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setData(transformData(chartData[year]));
  };

  const getYAxisUpperBound = (chartData: ChartItem[]) => {
    const bufferMultiplier = 1.1;
    const maxValue = Math.max(...chartData.map((item) => item.total));
    return Math.ceil(maxValue * bufferMultiplier);
  };

  const yAxisUpperBound = getYAxisUpperBound(data);

  return (
    <div className="mt-5">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text">
          Monthly Time Distribution
        </h1>
        <div className="flex gap-x-3 items-center">
          <div className="text-sm text-muted-foreground">Academic Years</div>
          <SelectCustom
            academicYearKeys={academicYearKeys}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            fontSize={fontSize}
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, yAxisUpperBound]}
            label={{
              value: "Hours",
              angle: -90,
              position: "insideLeft",
              fontSize,
            }}
          />
          <Bar dataKey="total" barSize={50} radius={[10, 10, 0, 0]}>
            <LabelList position="top" dataKey="total" fillOpacity={1} />
            {data.map((item) => (
              <Cell key={item.name} fill={"hsl(var(--primary))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface SelectCustomProps {
  academicYearKeys: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export function SelectCustom({
  academicYearKeys,
  selectedYear,
  onYearChange,
}: SelectCustomProps) {
  return (
    <Select value={selectedYear} onValueChange={onYearChange}>
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
  );
}
