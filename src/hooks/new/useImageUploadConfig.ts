import { GET_USER_IMG_UPLOAD_CONFIG_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
}

export function useImgUploadConfig() {
  const { data, error } = useSWR<CloudinaryConfig>(
    GET_USER_IMG_UPLOAD_CONFIG_ENDPOINT,
    fetcher
  );
  const [userConfig, setUserConfig] = useState<CloudinaryConfig>({
    cloudName: "",
    apiKey: "",
  });

  useEffect(() => {
    if (data) {
      const userConfig = {
        cloudName: data.cloudName,
        apiKey: data.apiKey,
      };
      setUserConfig(userConfig);
    }
  }, [data]);

  return {
    userConfig,
    isLoading: !data && !error,
    error,
  };
}
