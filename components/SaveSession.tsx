"use client";

import { FC, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { getSessionLog, persistSession } from "@/lib/session-log/utils";
import { SessionLog } from "@/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useStudySession } from "@/src/hooks/useStudySession";
import { useSession } from "next-auth/react";
import { SAVE_SESSION_ENDPOINT, HTTP_METHOD } from "@/constants/config";
import { usePersistSession } from "@/src/hooks/usePersistSession";

const SaveSession = ({}) => {
  const { data: session, status: sessionStatus } = useSession();

  const {
    sessionTimer: {
      effectiveTimeOfStudy,
      sessionStartTime,
      sessionEndTime,
      totalPauseTime,
      status,
    },
    setSessionTimer,
  } = useContext(TimeContext);
  const { sessionText } = useContext(SessionTextContext);
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("saveSession");

  const sessionLog: SessionLog = getSessionLog(
    sessionText,
    sessionStartTime,
    sessionEndTime,
    totalPauseTime
  );

  const { isLoading, httpRequestHandler: saveSessionHandler } =
    usePersistSession({
      body: sessionLog,
      url: SAVE_SESSION_ENDPOINT,
      method: HTTP_METHOD.POST,
      onSuccess: resetStudySession,
    });

  return (
    <Alert title={title} description={description} action={saveSessionHandler}>
      <Button variant="default" disabled={status !== "stop"}>
        {isLoading && <Icons.loading className="h-6 w-6 animate-spin" />}
        {!isLoading && <Icons.save />}
      </Button>
    </Alert>
  );
};

export default SaveSession;
