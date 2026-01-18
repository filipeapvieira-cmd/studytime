import useSWR from "swr";
import { GET_COMMUNITY_SESSIONS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import type { CommunityDataStructure } from "@/src/types/charts";

export const useCommunityAnalytics = () => {
  const { data, error } = useSWR<{
    data: CommunityDataStructure;
  }>(GET_COMMUNITY_SESSIONS_ENDPOINT, fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
};
