"use client";

import { useState } from "react";
import { FullSessionLog } from "@/src/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { getRequestHandler } from "@/src/lib/session-log/delete-utils";

interface PersistSession {
  body?: FullSessionLog;
  url: string;
  method: string;
  onSuccess?: () => void;
}

export const usePersistSession = () => {
  const { showToastError, showToastSuccess } = useFetchStatusToastHandling();
  const [isLoading, setIsLoading] = useState(false);

  const httpRequestHandler = async ({
    body,
    url,
    method,
    onSuccess,
  }: PersistSession) => {
    const requestHandler = getRequestHandler(body, url, method);

    try {
      setIsLoading(true);
      //await is required, otherwise try-catch block don't catch the error
      const response = await requestHandler();
      showToastSuccess(response);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, httpRequestHandler };
};
