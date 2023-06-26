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
import {
  UploadImagesContext,
  uploadImagesCtxDefaultValues,
} from "@/src/ctx/upload-images-provider";
import { retrieveTextFromJson } from "@/lib/utils";

interface NewSessionProps {}

const NewSession: FC<NewSessionProps> = ({}) => {
  //console.count("NewSession");
  const { setSessionText } = useContext(SessionTextContext);
  const { setSessionTimer } = useContext(TimeContext);
  const { setSessionChrono } = useContext(ChronoContext);
  const { setValidFile } = useContext(UploadImagesContext);

  const { title, description } = retrieveTextFromJson("restartSession");

  // set default values
  const reStartSessionHandler = () => {
    setSessionText(sessionTextCtxDefaultValues.sessionText);
    setSessionTimer(timeCtxDefaultValues.sessionTimer);
    setSessionChrono(chronoCtxDefaultValues.sessionChrono);
    setValidFile(uploadImagesCtxDefaultValues.validFile);
  };

  return (
    <Alert
      title={title}
      description={description}
      action={reStartSessionHandler}
    >
      <Button variant="default">
        <Icons.newSession />
      </Button>
    </Alert>
  );
};

export default NewSession;
