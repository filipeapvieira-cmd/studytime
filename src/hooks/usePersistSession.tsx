"use client";

import { FC, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { getSessionLog, persistSession } from "@/lib/session-log/utils";
import { SessionLog, SessionLogUpdate } from "@/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useStudySession } from "@/src/hooks/useStudySession";
import { useSession } from "next-auth/react";
import { SAVE_SESSION_ENDPOINT, HTTP_METHOD } from "@/constants/config";

interface PersistSessionProps {
  sessionLog: SessionLog | SessionLogUpdate;
  url: string;
  method: string;
}

export const usePersistSession = ({
  sessionLog,
  url,
  method,
}: PersistSessionProps) => {
  const { showToastError, showToastSuccess } = useFetchStatusToastHandling();
  const [isLoading, setIsLoading] = useState(false);
  const { title, description } = retrieveTextFromJson("saveSession");

  const saveSessionHandler = async () => {
    try {
      setIsLoading(true);
      const response = await persistSession(sessionLog, url, method);
      showToastSuccess(response);
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, saveSessionHandler };
};
