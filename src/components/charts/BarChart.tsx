"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { studySessionDto } from "@/src/types";
import { format } from "date-fns";
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
  getPredefinedDateRanges,
  PredefinedDateRangeKey,
} from "@/src/lib/charts/utils";
import { DateRange } from "react-day-picker";
import { DateRangeSelector } from "./DateRangeSelector";
import { CUSTOM_RANGE, THIS_WEEK } from "@/src/constants/constants.charts";
interface BarChartProps {
  studySessions: studySessionDto[];
}

const BarChartCustom: FC<BarChartProps> = ({ studySessions }) => {
  const studySessionsDates = studySessions.map(
    (session) => new Date(session.date)
  );
  const predefinedDateRanges = getPredefinedDateRanges(studySessionsDates);

  const [range, setRange] = useState<DateRange | undefined>(
    predefinedDateRanges[THIS_WEEK]
  );

  const [selectedPredefinedRange, setSelectedPredefinedRange] =
    useState<string>(THIS_WEEK);

  const fontSize = 15;
  const isMessageVisible = range?.from && range?.to;

  const filterStudySessions = useCallback(() => {
    if (!range?.from) {
      return studySessions;
    }

    const from = range.from;
    const to = range.to ?? from;

    return studySessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= from && sessionDate <= to;
    });
  }, [range, studySessions]);

  const chartData = useMemo(() => {
    const filteredSessions = filterStudySessions();
    return getTotalStudiedTimePerDayOfTheWeek(filteredSessions);
  }, [filterStudySessions]);

  // Handle selection from the predefined ranges
  const handlePredefinedRangeSelect = (value: PredefinedDateRangeKey) => {
    const selectedRange = predefinedDateRanges[value];
    if (selectedRange) {
      setRange(selectedRange);
      setSelectedPredefinedRange(value);
    }
  };

  // Handle custom range selection
  const handleCustomRangeSelect = (newRange: DateRange | undefined) => {
    if (!newRange) return;

    const { from, to } = newRange;
    if (from && !to) {
      setRange({ from, to: from });
    } else {
      setRange(newRange);
    }
    setSelectedPredefinedRange(CUSTOM_RANGE);
  };

  return (
    <div className="mt-4">
      <div className="flex flex-row justify-between py-4">
        <DateRangeSelector
          range={range}
          selectedPredefinedRange={selectedPredefinedRange}
          predefinedDateRanges={predefinedDateRanges}
          onPredefinedRangeSelect={handlePredefinedRangeSelect}
          onCustomRangeSelect={handleCustomRangeSelect}
        />
        {isMessageVisible && (
          <div className="text-sm text-muted-foreground">
            Showing data for {format(range?.from ?? new Date(), "PPP")} to{" "}
            {format(range?.to ?? new Date(), "PPP")}
          </div>
        )}
      </div>
      {chartData && chartData.length > 0 ? (
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
      ) : (
        <div className="mt-4 text-center text-muted-foreground">
          No results found...
        </div>
      )}
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
