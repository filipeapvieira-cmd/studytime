"use client";

import { FC, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { getSessionLog, persistSession } from "@/lib/session-log/utils";
import {SessionLog} from "@/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useStudySession } from "@/src/hooks/useStudySession";
import { useSession } from "next-auth/react";

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
  const {showToastError, showToastSuccess} = useFetchStatusToastHandling();
  const [isLoading, setIsLoading] = useState(false);
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("saveSession");

  const saveSessionHandler = async () => {
    const sessionLog: SessionLog = getSessionLog(sessionText, sessionStartTime, sessionEndTime, totalPauseTime);
    try {
      setIsLoading(true);
      const response = await persistSession(sessionLog);
      showToastSuccess(response);
      resetStudySession();
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
    //console.log(getSessionLog(sessionText, sessionStartTime, sessionEndTime, totalPauseTime));
  };

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
