import { Suspense } from "react";
import { getStudySessionsByUserId } from "@/src/data/study-sessions";
import { StudySessionsResponse } from "@/src/types/study-sessions";
import ChartDashboard from "@/src/components/charts/ChartDashboard";
import BarChartSkeleton from "@/src/components/skeletons/BarChartSkeleton";

function ChartsPage() {
  return (
    <Suspense fallback={<BarChartSkeleton />}>
      <ChartsData />
    </Suspense>
  );
}

export default ChartsPage;

async function ChartsData() {
  const response: StudySessionsResponse = await getStudySessionsByUserId();
  const { data, status } = response;

  if (status === "error") {
    throw new Error(response.message);
  }

  return (
    <div className="container mx-auto">
      <ChartDashboard studySessions={data} />
    </div>
  );
}
