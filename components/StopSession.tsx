"use client";

import { FC, use, useContext, useState } from "react";
import { TimeContext } from "@/src/ctx/time-provider";
import { ChronoContext } from "@/src/ctx/chrono-provider";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { SessionTimer } from "@/types";

interface StopSessionProps {}

const StopSession: FC<StopSessionProps> = ({}) => {
  //console.count("StopSession");
  const {
    sessionTimer: { status },
    setSessionTimer,
  } = useContext(TimeContext);
  const { setSessionChrono } = useContext(ChronoContext);

  const { title, description } = retrieveTextFromJson("stopSession");

  const stopSessionHandler = () => {
    setSessionTimer((prevState: SessionTimer) => ({
      ...prevState,
      status: "stop",
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
        disabled={status === "initial" || status === "stop"}
      >
        <Icons.stop />
      </Button>
    </Alert>
  );
};

export default StopSession;
