import { useEffect, useState } from "react";
import useSWR from "swr";
import { GET_UNIQUE_HASHTAGS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";

interface HashtagResponse {
  data: string[];
}

export function useHashtags() {
  const { data, error } = useSWR<HashtagResponse>(
    GET_UNIQUE_HASHTAGS_ENDPOINT,
    fetcher,
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
