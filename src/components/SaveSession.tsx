"use client";

import { useContext } from "react";
import { Button } from "@/src/components/ui/button";
import { Icons } from "@/src/components/icons";
import Alert from "@/src/components/Alert";
import { retrieveTextFromJson } from "@/src/lib/utils";
import { useTimeContext } from "@/src/ctx/time-provider";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { getFullSessionLog } from "@/src/lib/session-log/utils";
import { FullSessionLog } from "@/src/types";
import { useStudySession } from "@/src/hooks/useStudySession";
import { SAVE_SESSION_ENDPOINT, HTTP_METHOD } from "@/src/constants/config";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { useFetch } from "@/src/hooks/useFetch";

export const SaveSessionBtn = () => {
  const { getLastTimer, status } = useTimeContext();
  const { sessionFeelings } = useContext(FeelingsContext);
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("saveSession");
  const { sessionTopics } = useContext(TopicsContext);
  let sessionLog: FullSessionLog | undefined = undefined;

  const { isLoading, callAPI } = useFetch();

  const onClickHandler = async () => {
    const sessionTime = getLastTimer();

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
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-full bg-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        disabled={status !== "stop"}
      >
        {isLoading && <Icons.loading className="h-6 w-6 animate-spin" />}
        {!isLoading && <Icons.save />}
      </Button>
    </Alert>
  );
};
