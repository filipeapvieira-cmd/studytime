import { useContext } from "react";
import {
  FeelingsContext,
  feelingsCtxDefaultValues,
} from "@/src/ctx/session-feelings-provider";
import { TimeContext, timeCtxDefaultValues } from "@/src/ctx/time-provider";
import {
  ChronoContext,
  chronoCtxDefaultValues,
} from "@/src/ctx/chrono-provider";
import {
  UploadImagesContext,
  uploadImagesCtxDefaultValues,
} from "@/src/ctx/upload-images-provider";
import {
  TopicsContext,
  topicsCtxDefaultValues,
} from "../ctx/session-topics-provider";

export const useStudySession = () => {
  const { setSessionFeelings } = useContext(FeelingsContext);
  const { setSessionTimer } = useContext(TimeContext);
  const { setSessionChrono } = useContext(ChronoContext);
  const { setValidFile } = useContext(UploadImagesContext);
  const { setSessionTopics } = useContext(TopicsContext);

  const resetStudySession = () => {
    setSessionFeelings(feelingsCtxDefaultValues.sessionFeelings);
    setSessionTimer(timeCtxDefaultValues.sessionTimer);
    setSessionChrono(chronoCtxDefaultValues.sessionChrono);
    setValidFile(uploadImagesCtxDefaultValues.validFile);
    console.trace("About to set session topics");
    setSessionTopics([]);
  };
  return { resetStudySession };
};
