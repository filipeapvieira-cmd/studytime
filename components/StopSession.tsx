"use client";

import { FC, useContext, useState } from "react";
import { TimeContext } from "@/src/ctx/time-provider";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveText } from "@/lib/utils";

interface StopSessionProps {}

const StopSession: FC<StopSessionProps> = ({}) => {
  const {
    sessionTimer: { status },
    setSessionTimer,
  } = useContext(TimeContext);

  const { title, description } = retrieveText("stopSession");

  const stopSessionHandler = () => {
    setSessionTimer((prevState) => ({
      ...prevState,
      status: "stop",
    }));
  };

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
