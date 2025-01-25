import useSWR from "swr";
import { GET_ALL_SESSIONS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { studySessionDto } from "@/src/types";

interface UseStudySessionsResult {
  data: studySessionDto[] | undefined;
  isLoading: boolean;
  error: any;
}

export const useUserStudySessions = (): UseStudySessionsResult => {
  const { data, error } = useSWR<{ data: studySessionDto[] }>(
    GET_ALL_SESSIONS_ENDPOINT,
    fetcher
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
};
