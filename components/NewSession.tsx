"use client";

import { FC, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import alerts from "@/text/alerts.json";
import {
  SessionTextContext,
  sessionTextCtxDefaultValues,
} from "@/src/ctx/session-text-provider";
import { TimeContext, timeCtxDefaultValues } from "@/src/ctx/time-provider";
import {
  ChronoContext,
  chronoCtxDefaultValues,
} from "@/src/ctx/chrono-provider";

interface NewSessionProps {}

const NewSession: FC<NewSessionProps> = ({}) => {
  const { setSessionText } = useContext(SessionTextContext);
  const { setSessionTimer } = useContext(TimeContext);
  const { setSessionChrono } = useContext(ChronoContext);

  const newSession = () => {
    setSessionText(sessionTextCtxDefaultValues.sessionText);
    setSessionTimer(timeCtxDefaultValues.sessionTimer);
    setSessionChrono(chronoCtxDefaultValues.sessionChrono);
  };

  const restartSessionAlert = alerts.restartSession;
  const title = restartSessionAlert.title;
  const description = restartSessionAlert.description;

  return (
    <Alert title={title} description={description}>
      <Button variant="ghost" onClick={newSession}>
        <Icons.newSession />
      </Button>
    </Alert>
  );
};

export default NewSession;
