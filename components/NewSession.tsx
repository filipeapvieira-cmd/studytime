"use client";

import { FC, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";

import {
  SessionTextContext,
  sessionTextCtxDefaultValues,
} from "@/src/ctx/session-text-provider";
import { TimeContext, timeCtxDefaultValues } from "@/src/ctx/time-provider";
import {
  ChronoContext,
  chronoCtxDefaultValues,
} from "@/src/ctx/chrono-provider";
import { retrieveText } from "@/lib/utils";

interface NewSessionProps {}

const NewSession: FC<NewSessionProps> = ({}) => {
  const { setSessionText } = useContext(SessionTextContext);
  const { setSessionTimer } = useContext(TimeContext);
  const { setSessionChrono } = useContext(ChronoContext);

  const { title, description } = retrieveText("restartSession");

  // set default values
  const reStartSessionHandler = () => {
    setSessionText(sessionTextCtxDefaultValues.sessionText);
    setSessionTimer(timeCtxDefaultValues.sessionTimer);
    setSessionChrono(chronoCtxDefaultValues.sessionChrono);
  };

  return (
    <Alert
      title={title}
      description={description}
      action={reStartSessionHandler}
    >
      <Button variant="ghost">
        <Icons.newSession />
      </Button>
    </Alert>
  );
};

export default NewSession;
