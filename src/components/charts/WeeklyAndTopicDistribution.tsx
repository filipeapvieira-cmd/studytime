"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import useStudySessionFilter from "@/src/hooks/useStudySessionFilter";
import { getTotalStudiedTimePerDayOfTheWeek } from "@/src/lib/charts/utils";
import type { StudySessionDto } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DateRangeSelector } from "./DateRangeSelector";
import TopicDistributionChart from "./TopicDistributionChart";
import WeeklyDistributionChart from "./WeeklyDistributionChart";

type WeeklyAndTopicDistributionProps = {
  data: StudySessionDto[];
};

export const WeeklyAndTopicDistribution = ({
  data,
}: WeeklyAndTopicDistributionProps) => {
  const studySessions = data;
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
    <Card className="flex flex-col gap-y-5">
      <CardHeader className="flex flex-col gap-y-6">
        <CardTitle className="text-xl md:text-3xl text-white">
          Custom Timeframe <span className="text-blue-400">Analysis</span>
        </CardTitle>
        <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:items-center lg:flex-row justify-between">
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
      </CardHeader>
      <CardContent>
        {filteredStudySessions.length > 0 ? (
          <div className="flex flex-col lg:flex-row w-full">
            <WeeklyDistributionChart chartData={barChartData} />
            <TopicDistributionChart chartData={topicDistributionData} />
          </div>
        ) : (
          <div className="mt-4 text-center text-muted-foreground">
            No results found...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
