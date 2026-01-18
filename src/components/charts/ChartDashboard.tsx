"use client";

import { Clock, Users } from "lucide-react";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupSessionsByAcademicYear } from "@/src/lib/charts/monthlyDistributionChart.utils";
import { isEmpty } from "@/src/lib/charts/utils";
import type { StudySessionDto } from "@/src/types";
import type { CommunityDataStructure } from "@/src/types/charts";
import UnexpectedEvent from "../Unexpected-Event";
import { CommunityMonthlyDistributionChart } from "./Community-Monthly";
import { MonthlyDistributionChart } from "./MonthlyDistributionChart";
import { WeeklyAndTopicDistribution } from "./WeeklyAndTopicDistribution";

interface ChartDashboardProps {
  studySessions: StudySessionDto[];
  communityData: CommunityDataStructure | {};
}

const unexpectedEventConfig = {
  header: "No study sessions found",
  message:
    "It looks like you haven't logged any sessions yet. Start by  adding your first study session to track your progress!",
};

const ChartDashboard = ({
  studySessions,
  communityData,
}: ChartDashboardProps) => {
  const monthlyDistributionData = useMemo(() => {
    return groupSessionsByAcademicYear(studySessions);
  }, [studySessions]);

  if (!studySessions.length) {
    return <UnexpectedEvent config={unexpectedEventConfig} />;
  }

  return (
    <Tabs defaultValue="timeDistribution">
      <TabsList className="mx-auto w-full bg-[#1C1C1C] border-[#2A2A2A]">
        <TabsTrigger value="timeDistribution" className="flex gap-x-2">
          Time Distribution <Clock className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="community" className="flex gap-x-2 ">
          Community <Users className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="timeDistribution">
        <div className="mt-4 flex flex-col gap-y-10">
          <MonthlyDistributionChart chartData={monthlyDistributionData} />
          <WeeklyAndTopicDistribution data={studySessions} />
        </div>
      </TabsContent>
      {!isEmpty(communityData) && (
        <TabsContent value="community">
          <CommunityMonthlyDistributionChart
            data={communityData as CommunityDataStructure}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ChartDashboard;
