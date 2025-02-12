import { GET_UNIQUE_TOPICS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { useState, useEffect } from "react";
import useSWR from "swr";

interface TopicsResponse {
  data: string[];
}

export function useTopicTitle() {
  const { data, error } = useSWR<TopicsResponse>(
    GET_UNIQUE_TOPICS_ENDPOINT,
    fetcher
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
