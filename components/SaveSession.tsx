"use client";

import { FC, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveText } from "@/lib/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import { SessionTextContext } from "@/src/ctx/session-text-provider";

const SaveSession = ({}) => {
  const {
    sessionTimer: {
      currentTimeOfStudy,
      sessionStartTime,
      sessionEndTime,
      totalPauseTime,
      status,
    },
    setSessionTimer,
  } = useContext(TimeContext);
  const { sessionText } = useContext(SessionTextContext);

  const { title, description } = retrieveText("saveSession");

  const saveSessionHandler = () => {
    console.log(currentTimeOfStudy);
    console.log(sessionStartTime);
    console.log(sessionEndTime);
    console.log(totalPauseTime);

    console.log(sessionText);
  };

  return (
    <Alert title={title} description={description} action={saveSessionHandler}>
      <Button variant="ghost" disabled={status !== "stop"}>
        <Icons.save />
      </Button>
    </Alert>
  );
};

export default SaveSession;
