"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Icons } from "@/src/components/icons";
import Alert from "@/src/components/Alert";
import { retrieveTextFromJson } from "@/src/lib/utils";
import { TimeContext, useTimeContext } from "@/src/ctx/time-provider";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { getFullSessionLog, persistSession } from "@/src/lib/session-log/utils";
import { FullSessionLog } from "@/src/types";
import { useFetchStatusToastHandling } from "@/src/hooks/useFetchStatusToastHandling";
import { useStudySession } from "@/src/hooks/useStudySession";
import { useSession } from "next-auth/react";
import { SAVE_SESSION_ENDPOINT, HTTP_METHOD } from "@/src/constants/config";
import { usePersistSession } from "@/src/hooks/usePersistSession";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { useFetch } from "@/src/hooks/useFetch";

const SaveSession = ({}) => {
  const { getLastSessionTimer, status } = useTimeContext();
  const { sessionFeelings } = useContext(FeelingsContext);
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("saveSession");
  const { sessionTopics } = useContext(TopicsContext);
  let sessionLog: FullSessionLog | undefined = undefined;

  /* const { isLoading, httpRequestHandler: saveSessionHandler } =
    usePersistSession(); */
  const { isLoading, callAPI } = useFetch();

  const onClickHandler = async () => {
    const sessionTime = getLastSessionTimer();

    sessionLog = getFullSessionLog({
      sessionFeelings,
      sessionTopics,
      sessionTime,
    });

    await callAPI({
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
