"use client";

import { useMemo } from "react";
import { studySessionDto } from "@/src/types";
import { format } from "date-fns";
import { getTotalStudiedTimePerDayOfTheWeek } from "@/src/lib/charts/utils";
import { DateRangeSelector } from "./DateRangeSelector";
import BarChartCustom from "./BarChart";
import TopicDistributionChart from "./TopicDistributionChart";
import useStudySessionFilter from "@/src/hooks/useStudySessionFilter";
import { Tabs } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { MonthlyDistributionChart } from "./MonthlyDistributionChart";
import { groupSessionsByAcademicYear } from "@/src/lib/charts/monthlyDistributionChart.utils";

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

  const monthlyDistributionData = useMemo(() => {
    return groupSessionsByAcademicYear(studySessions);
  }, [studySessions]);

  return (
    <Tabs defaultValue="timeDistribution">
      <TabsList className="mx-auto w-full">
        <TabsTrigger value="timeDistribution">Time Distribution</TabsTrigger>
        <TabsTrigger value="password">Community</TabsTrigger>
      </TabsList>
      <TabsContent value="timeDistribution">
        <div className="mt-4">
          <MonthlyDistributionChart chartData={monthlyDistributionData} />
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
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default ChartDashboard;
