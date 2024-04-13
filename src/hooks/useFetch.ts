import { useState } from "react";
import { FullSessionLog } from "@/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useCustomToast } from "./useCustomToast";

type CallAPIParams = {
  body?: FullSessionLog | object;
  url: string;
  method: string;
  onSuccess?: (data: any) => void;
  onFailure?: (error: Error) => void;
};

export const useFetch = () => {
  const { showToast } = useCustomToast();

  const [isLoading, setIsLoading] = useState(false);

  const callAPI = async ({
    body,
    url,
    method,
    onSuccess,
    onFailure,
  }: CallAPIParams) => {
    try {
      setIsLoading(true);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
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
        onSuccess(data);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      showToast({ status: "error", message: errorMessage });
      if (onFailure) {
        onFailure(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, callAPI };
};
