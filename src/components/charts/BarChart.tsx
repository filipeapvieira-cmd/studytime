"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { studySessionDto } from "@/src/types";
import { addDays, format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
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
import { CalendarDateRangePicker } from "../Date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
interface BarChartProps {
  studySessions: studySessionDto[];
}

// Define the start of the week as Sunday (0)
const WEEK_START_DAY = 0; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const THIS_WEEK = "This Week";
const LAST_WEEK = "Last Week";
const LAST_30_DAYS = "Last 30 Days";
const CUSTOM_RANGE = "Custom Range";

const predefinedDateRanges: { [key: string]: { from: Date; to: Date } } = {
  [THIS_WEEK]: {
    from: startOfWeek(new Date(), { weekStartsOn: WEEK_START_DAY }),
    to: endOfWeek(new Date(), { weekStartsOn: WEEK_START_DAY }),
  },
  [LAST_WEEK]: {
    from: startOfWeek(subWeeks(new Date(), 1), {
      weekStartsOn: WEEK_START_DAY,
    }),
    to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: WEEK_START_DAY }),
  },
  [LAST_30_DAYS]: {
    from: addDays(new Date(), -30),
    to: new Date(),
  },
};

const BarChartCustom: FC<BarChartProps> = ({ studySessions }) => {
  const [chartData, setChartData] = useState<
    { name: string; total: number }[] | null
  >(null);

  const [range, setRange] = useState<DateRange | undefined>({
    from: predefinedDateRanges[THIS_WEEK].from,
    to: predefinedDateRanges[THIS_WEEK].to,
  });

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

  useEffect(() => {
    const filteredSessions = filterStudySessions();
    const processedData = getTotalStudiedTimePerDayOfTheWeek(filteredSessions);
    setChartData(processedData);
  }, [filterStudySessions, range, studySessions]);

  // Handle selection from the predefined ranges
  const handlePredefinedRangeSelect = (value: string) => {
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
        <div className="flex gap-x-3">
          <CalendarDateRangePicker
            date={range}
            setDate={handleCustomRangeSelect}
          />
          {/* Select Dropdown for Predefined Ranges */}
          <Select
            value={selectedPredefinedRange || undefined}
            onValueChange={handlePredefinedRangeSelect}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(predefinedDateRanges).map((rangeKey) => (
                <SelectItem key={rangeKey} value={rangeKey}>
                  {rangeKey}
                </SelectItem>
              ))}
              <SelectItem value={CUSTOM_RANGE} disabled>
                {CUSTOM_RANGE}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
