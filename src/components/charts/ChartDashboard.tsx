"use client";

import { useMemo } from "react";
import { studySessionDto } from "@/src/types";
import { format } from "date-fns";
import { getTotalStudiedTimePerDayOfTheWeek } from "@/src/lib/charts/utils";
import { DateRangeSelector } from "./DateRangeSelector";
import BarChartCustom from "./BarChart";
import TopicDistributionChart from "./TopicDistributionChart";
import useStudySessionFilter from "@/src/hooks/useStudySessionFilter";

interface ChartDashboardProps {
  studySessions: studySessionDto[];
}

const ChartDashboard = ({ studySessions }: ChartDashboardProps) => {
  const {
    range,
    selectedPredefinedRange,
    predefinedDateRanges,
    isMessageVisible,
    handlePredefinedRangeSelect,
    handleCustomRangeSelect,
    filteredStudySessions,
  } = useStudySessionFilter({ studySessions });

  const barChartData = useMemo(() => {
    return getTotalStudiedTimePerDayOfTheWeek(filteredStudySessions);
  }, [filteredStudySessions]);

  const topicDistributionData = useMemo(() => {
    const topicMap: { [title: string]: number } = {};

    filteredStudySessions.forEach((session) => {
      session.topics.forEach((topic) => {
        if (topicMap[topic.title]) {
          topicMap[topic.title] += topic.effectiveTimeOfStudy;
        } else {
          topicMap[topic.title] = topic.effectiveTimeOfStudy;
        }
      });
    });

    // Convert the map to an array suitable for Recharts
    return Object.keys(topicMap).map((title) => ({
      name: title,
      value: topicMap[title],
    }));
  }, [filteredStudySessions]);

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
      {filteredStudySessions.length > 0 ? (
        <div className="flex flex-col gap-y-6">
          <BarChartCustom chartData={barChartData} />
          <TopicDistributionChart chartData={topicDistributionData} />
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
