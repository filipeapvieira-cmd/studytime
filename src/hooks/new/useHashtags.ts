import { GET_UNIQUE_HASHTAGS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { useState, useEffect } from "react";
import useSWR from "swr";

interface HashtagResponse {
  data: string[];
}

export function useHashtags() {
  const { data, error } = useSWR<HashtagResponse>(
    GET_UNIQUE_HASHTAGS_ENDPOINT,
    fetcher
  );
  const [hashtagsList, setHashtagsList] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setHashtagsList(data.data);
    }
  }, [data]);

  return {
    hashtagsList,
    isLoading: !data && !error,
    error,
    setHashtagsList,
  };
}
