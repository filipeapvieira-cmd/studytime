"use client";

import { FC, use, useContext, useState } from "react";
import { TimeContext, useTimeContext } from "@/src/ctx/time-provider";
import { ChronoContext } from "@/src/ctx/chrono-provider";
import { Button } from "@/src/components/ui/button";
import { Icons } from "@/src/components/icons";
import Alert from "@/src/components/Alert";
import { retrieveTextFromJson } from "@/src/lib/utils";
import { Timer } from "@/src/types";
import { SessionStatusEnum } from "@/src/constants/config";
import { updateTimerStatus } from "@/src/lib/time-provider/utils";

interface StopSessionProps {}

const StopSession: FC<StopSessionProps> = ({}) => {
  //console.count("StopSession");
  const {
    Timer: { status },
    updateTimer,
  } = useTimeContext();
  const { setSessionChrono } = useContext(ChronoContext);

  const { title, description } = retrieveTextFromJson("stopSession");

  const stopSessionHandler = () => {
    updateTimerStatus(SessionStatusEnum.Stop, updateTimer);

    setSessionChrono((prevState: Timer) => ({
      ...prevState,
      isActive: false,
    }));
  };

  return (
    <Alert title={title} description={description} action={stopSessionHandler}>
      <Button
        variant="default"
        disabled={
          status === SessionStatusEnum.Initial ||
          status === SessionStatusEnum.Stop
        }
      >
        <Icons.stop />
      </Button>
    </Alert>
  );
};

export default StopSession;
