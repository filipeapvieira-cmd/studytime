"use client";

import { FC, use, useContext, useState } from "react";
import { TimeContext, useTimeContext } from "@/src/ctx/time-provider";
import { ChronoContext } from "@/src/ctx/chrono-provider";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { SessionTimer } from "@/types";
import { SessionStatusEnum } from "@/constants/config";

interface StopSessionProps {}

const StopSession: FC<StopSessionProps> = ({}) => {
  //console.count("StopSession");
  const {
    sessionTimer: { status },
    updateSessionTimer,
  } = useTimeContext();
  const { setSessionChrono } = useContext(ChronoContext);

  const { title, description } = retrieveTextFromJson("stopSession");

  const stopSessionHandler = () => {
    updateSessionTimer((prevState: SessionTimer) => ({
      ...prevState,
      status: SessionStatusEnum.Stop,
    }));

    setSessionChrono((prevState: SessionTimer) => ({
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
