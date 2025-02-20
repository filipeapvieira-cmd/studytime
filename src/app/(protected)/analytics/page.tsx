"use client";

import ChartDashboard from "@/src/components/charts/ChartDashboard";
import { useUserStudySessions } from "@/src/hooks/new/useUserStudySessions";
import { useErrorToast } from "@/src/hooks/new/useErrorToast";
import BarChartSkeleton from "@/src/components/skeletons/BarChartSkeleton";
import { useCommunityAnalytics } from "@/src/hooks/new/useCommunityAnalytics";

const AnalyticsPage = () => {
  const {
    data: userStudySessions,
    isLoading: userIsLoading,
    error: userError,
  } = useUserStudySessions();

  const {
    data: communityData,
    isLoading: communityIsLoading,
    error: communityError,
  } = useCommunityAnalytics();

  const isLoading = userIsLoading || communityIsLoading;
  const error = userError || communityError;

  useErrorToast(
    error,
    "Unable to fetch data for charts. Please try again later."
  );

  if (isLoading) return <BarChartSkeleton />;

  return (
    <div className="max-w-6xl w-4/5 mx-auto">
      <ChartDashboard
        studySessions={userStudySessions || []}
        communityData={communityData || {}}
      />
    </div>
  );
};

export default AnalyticsPage;
