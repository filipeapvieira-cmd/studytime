"use client";

import ChartDashboard from "@/src/components/charts/ChartDashboard";
import { useStudySessions } from "@/src/hooks/new/useStudySessions";
import { useErrorToast } from "@/src/hooks/new/useErrorToast";
import BarChartSkeleton from "@/src/components/skeletons/BarChartSkeleton";

const ChartsPage = () => {
  const { data, isLoading, error } = useStudySessions();

  useErrorToast(
    error,
    "Unable to fetch data for charts. Please try again later."
  );

  if (isLoading) return <BarChartSkeleton />;

  return (
    <div className="container mx-auto">
      <ChartDashboard studySessions={data || []} />
    </div>
  );
};

export default ChartsPage;
