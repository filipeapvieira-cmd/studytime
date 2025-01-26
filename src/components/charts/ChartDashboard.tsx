"use client";

import { useMemo } from "react";
import { studySessionDto } from "@/src/types";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { MonthlyDistributionChart } from "./MonthlyDistributionChart";
import { groupSessionsByAcademicYear } from "@/src/lib/charts/monthlyDistributionChart.utils";
import { WeeklyAndTopicDistribution } from "./WeeklyAndTopicDistribution";
import { CommunityMonthlyDistributionChart } from "./Community-Monthly";
import { CommunityDataStructure } from "@/src/types/charts";
import { isEmpty } from "@/src/lib/charts/utils";
import UnexpectedEvent from "../Unexpected-Event";
import { Clock, Users } from "lucide-react";

interface ChartDashboardProps {
  studySessions: studySessionDto[];
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
