"use client";

import { FC, useContext, useState } from "react";
import { TimeContext } from "@/src/ctx/time-provider";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import alerts from "@/text/alerts.json";

interface StopSessionProps {}

const StopSession: FC<StopSessionProps> = ({}) => {
  const {
    sessionTimer: { status },
    setSessionTimer,
  } = useContext(TimeContext);

  const stopSessionHandler = () => {
    setSessionTimer((prevState) => ({
      ...prevState,
      status: "stop",
    }));
  };

  const restartSessionAlert = alerts.stopSession;
  const title = restartSessionAlert.title;
  const description = restartSessionAlert.description;

  return (
    <Alert title={title} description={description} action={stopSessionHandler}>
      <Button
        variant="ghost"
        disabled={status === "initial" || status === "stop"}
      >
        <Icons.stop />
      </Button>
    </Alert>
  );
};

export default StopSession;
