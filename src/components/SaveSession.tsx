"use client";

import { useContext } from "react";
import Alert from "@/src/components/Alert";
import { Icons } from "@/src/components/icons";
import { Button } from "@/src/components/ui/button";
import { HTTP_METHOD, SAVE_SESSION_ENDPOINT } from "@/src/constants/config";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { useTimeContext } from "@/src/ctx/time-provider";
import { useFetch } from "@/src/hooks/useFetch";
import { useStudySession } from "@/src/hooks/useStudySession";
import { getFullSessionLog } from "@/src/lib/session-log/utils";
import { retrieveTextFromJson } from "@/src/lib/utils";
import type { FullSessionLog } from "@/src/types";

export const SaveSessionBtn = () => {
  const { getLastTimer, status } = useTimeContext();
  const { sessionFeelings } = useContext(FeelingsContext);
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("saveSession");
  const { sessionTopics } = useContext(TopicsContext);
  let sessionLog: FullSessionLog | undefined;

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
