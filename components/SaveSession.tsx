"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import { SessionTextContext } from "@/src/ctx/session-feelings-provider";
import { getFullSessionLog, persistSession } from "@/lib/session-log/utils";
import { FullSessionLog, SessionLog } from "@/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useStudySession } from "@/src/hooks/useStudySession";
import { useSession } from "next-auth/react";
import { SAVE_SESSION_ENDPOINT, HTTP_METHOD } from "@/constants/config";
import { usePersistSession } from "@/src/hooks/usePersistSession";
import { SaveSessionContext } from "@/src/ctx/session-topics-provider";

const SaveSession = ({}) => {
  const { getLastSessionTimer, status } = useContext(TimeContext);
  const { sessionText: sessionFeelings } = useContext(SessionTextContext);
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("saveSession");
  const { sessions: sessionTopics } = useContext(SaveSessionContext);
  let sessionLog: FullSessionLog | undefined = undefined;

  const { isLoading, httpRequestHandler: saveSessionHandler } =
    usePersistSession();

  const onClickHandler = () => {
    const { sessionStartTime, sessionEndTime, totalPauseTime } =
      getLastSessionTimer();

    const sessionTime = { sessionStartTime, sessionEndTime, totalPauseTime };
    try {
      sessionLog = getFullSessionLog({
        sessionFeelings,
        sessionTopics,
        sessionTime,
      });
      console.log(sessionLog);
    } catch (error) {
      console.log(error);
      return;
    }

    saveSessionHandler({
      body: sessionLog,
      url: SAVE_SESSION_ENDPOINT,
      method: HTTP_METHOD.POST,
      onSuccess: resetStudySession,
    });
  };

  return (
    <Alert title={title} description={description} action={onClickHandler}>
      <Button variant="default" disabled={status !== "stop"}>
        {isLoading && <Icons.loading className="h-6 w-6 animate-spin" />}
        {!isLoading && <Icons.save />}
      </Button>
    </Alert>
  );
};

export default SaveSession;
