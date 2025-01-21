"use client";

import { useEffect, useMemo } from "react";
import { studySessionDto } from "@/src/types";
import { Tabs } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { MonthlyDistributionChart } from "./MonthlyDistributionChart";
import { groupSessionsByAcademicYear } from "@/src/lib/charts/monthlyDistributionChart.utils";
import { WeeklyAndTopicDistribution } from "./WeeklyAndTopicDistribution";
import { CommunityMonthlyDistributionChart } from "./Community-Monthly";
import { CommunityData } from "@/src/types/community-analytics";

interface ChartDashboardProps {
  studySessions: studySessionDto[];
  communityData: CommunityData;
}

const ChartDashboard = ({
  studySessions,
  communityData,
}: ChartDashboardProps) => {
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
        <div className="mt-4 flex flex-col gap-y-10">
          <MonthlyDistributionChart chartData={monthlyDistributionData} />
          <WeeklyAndTopicDistribution data={studySessions} />
        </div>
      </TabsContent>
      <TabsContent value="password">
        <CommunityMonthlyDistributionChart data={communityData} />
      </TabsContent>
    </Tabs>
  );
};

export default ChartDashboard;
