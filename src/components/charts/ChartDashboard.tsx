"use client";

import { useCallback, useMemo, useState } from "react";
import { studySessionDto } from "@/src/types";
import { format } from "date-fns";
import {
  getTotalStudiedTimePerDayOfTheWeek,
  getPredefinedDateRanges,
  PredefinedDateRangeKey,
} from "@/src/lib/charts/utils";
import { DateRange } from "react-day-picker";
import { DateRangeSelector } from "./DateRangeSelector";
import { CUSTOM_RANGE, THIS_WEEK } from "@/src/constants/constants.charts";
import BarChartCustom from "./BarChart";
import TopicDistributionChart from "./TopicDistributionChart";

interface ChartDashboardProps {
  studySessions: studySessionDto[];
}

const ChartDashboard = ({ studySessions }: ChartDashboardProps) => {
  const studySessionsDates = studySessions.map(
    (session) => new Date(session.date)
  );
  const predefinedDateRanges = getPredefinedDateRanges(studySessionsDates);

  const [range, setRange] = useState<DateRange | undefined>(
    predefinedDateRanges[THIS_WEEK]
  );

  const [selectedPredefinedRange, setSelectedPredefinedRange] =
    useState<string>(THIS_WEEK);

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
        <div className="flex flex-col gap-y-3">
          <BarChartCustom chartData={chartData} />
          <TopicDistributionChart studySessions={studySessions} />
        </div>
      ) : (
        <div className="mt-4 text-center text-muted-foreground">
          No results found...
        </div>
      )}
    </div>
  );
};

export default ChartDashboard;
