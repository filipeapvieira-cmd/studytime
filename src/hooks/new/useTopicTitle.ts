import { useEffect, useState } from "react";
import useSWR from "swr";
import { GET_UNIQUE_TOPICS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";

interface TopicsResponse {
  data: string[];
}

export function useTopicTitle() {
  const { data, error } = useSWR<TopicsResponse>(
    GET_UNIQUE_TOPICS_ENDPOINT,
    fetcher,
  );
  const [topicsList, setTopicsList] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setTopicsList(data.data);
    }
  }, [data]);

  return {
    topicsList,
    isLoading: !data && !error,
    error,
  };
}
