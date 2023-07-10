"use client";

import { useState } from "react";
import { SessionLog, SessionLogUpdate } from "@/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { getRequestHandler } from "@/lib/session-log/delete-utils";

interface PersistSessionProps {
  body?: SessionLog | SessionLogUpdate;
  url: string;
  method: string;
  onSuccess?: () => void;
}

export const usePersistSession = ({
  body,
  url,
  method,
  onSuccess,
}: PersistSessionProps) => {
  const { showToastError, showToastSuccess } = useFetchStatusToastHandling();
  const [isLoading, setIsLoading] = useState(false);

  const httpRequestHandler = async () => {
    const requestHandler = getRequestHandler(body, url, method);

    try {
      setIsLoading(true);
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
