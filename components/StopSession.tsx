"use client";

import { FC, use, useContext, useState } from "react";
import { TimeContext } from "@/src/ctx/time-provider";
import { ChronoContext } from "@/src/ctx/chrono-provider";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveText } from "@/lib/utils";

interface StopSessionProps {}

const StopSession: FC<StopSessionProps> = ({}) => {
  //console.count("StopSession");
  const {
    sessionTimer: { status },
    setSessionTimer,
  } = useContext(TimeContext);
  const { setSessionChrono } = useContext(ChronoContext);

  const { title, description } = retrieveText("stopSession");

  const stopSessionHandler = () => {
    setSessionTimer((prevState) => ({
      ...prevState,
      status: "stop",
    }));
    setSessionChrono((prevState) => ({
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
