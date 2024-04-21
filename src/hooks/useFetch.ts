import { useCallback, useState } from "react";
import { FullSessionLog } from "@/src/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useCustomToast } from "./useCustomToast";
import { set } from "date-fns";

type CallAPIParams = {
  body?: FullSessionLog | object;
  url: string;
  method: string;
  next?: {};
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const useFetch = () => {
  console.log("useFetch rendering");

  const { showToast } = useCustomToast();

  const [isLoading, setIsLoading] = useState(false);

  const callAPI = useCallback(
    async ({
      body,
      url,
      method,
      next = {},
      onSuccess,
      onFailure,
    }: CallAPIParams) => {
      try {
        console.log("callAPI called for ", url);
        setIsLoading(true);

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          next: { ...next },
          body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Something went wrong. Server response with status ${response.status}`
          );
        }

        showToast({ status: "success", message: data.message });

        if (onSuccess) {
          onSuccess();
        }
        return data;
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong";
        showToast({ status: "error", message: errorMessage });
        if (onFailure) {
          onFailure();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  return { isLoading, callAPI };
};
