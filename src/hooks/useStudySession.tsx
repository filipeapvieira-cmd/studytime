import { useContext } from "react";
import {
  ChronoContext,
  chronoCtxDefaultValues,
} from "@/src/ctx/chrono-provider";
import {
  FeelingsContext,
  feelingsCtxDefaultValues,
} from "@/src/ctx/session-feelings-provider";
import {
  TimeContext,
  timeCtxDefaultValues,
  useTimeContext,
} from "@/src/ctx/time-provider";
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
  const { updateTimer } = useTimeContext();
  const { setSessionChrono } = useContext(ChronoContext);
  const { setValidFile } = useContext(UploadImagesContext);
  const { setSessionTopics } = useContext(TopicsContext);

  const resetStudySession = () => {
    setSessionFeelings(feelingsCtxDefaultValues.sessionFeelings);
    updateTimer(() => timeCtxDefaultValues.Timer);
    setSessionChrono(chronoCtxDefaultValues.sessionChrono);
    setValidFile(uploadImagesCtxDefaultValues.validFile);
    setSessionTopics([]);
  };
  return { resetStudySession };
};
