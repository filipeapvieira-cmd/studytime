import useSWR from "swr";
import { GET_COMMUNITY_SESSIONS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { MonthlyTotals } from "@/src/types/study-sessions";

interface UseCommunityAnalytics {
  data:
    | {
        userMonthlyTotals: MonthlyTotals;
        communityMonthlyTotals: MonthlyTotals;
      }
    | undefined;
  isLoading: boolean;
  error: any;
}

export const useCommunityAnalytics = (): UseCommunityAnalytics => {
  const { data, error } = useSWR<{
    data: {
      userMonthlyTotals: MonthlyTotals;
      communityMonthlyTotals: MonthlyTotals;
    };
  }>(GET_COMMUNITY_SESSIONS_ENDPOINT, fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
};
