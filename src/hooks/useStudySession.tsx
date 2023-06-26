import { useContext } from "react";
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

export const useStudySession = () => {
    const { setSessionText } = useContext(SessionTextContext);
    const { setSessionTimer } = useContext(TimeContext);
    const { setSessionChrono } = useContext(ChronoContext);
    const { setValidFile } = useContext(UploadImagesContext);

    const resetStudySession = () => {
        setSessionText(sessionTextCtxDefaultValues.sessionText);
        setSessionTimer(timeCtxDefaultValues.sessionTimer);
        setSessionChrono(chronoCtxDefaultValues.sessionChrono);
        setValidFile(uploadImagesCtxDefaultValues.validFile);
    }
    return { resetStudySession };
}