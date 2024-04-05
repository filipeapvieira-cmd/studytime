import { useEffect } from "react";
import {
  handleEffectiveTimeOfStudyIncrease,
  sessionStatusToHandlerMap,
} from "@/lib/time-provider/utils";
import { SessionStatus, SessionTimer } from "@/types";

const useEffectStatusHandling = (
  status: SessionStatus,
  updateTimer: (updateFunction: (prev: SessionTimer) => SessionTimer) => void
) => {
  useEffect(() => {
    let interval: NodeJS.Timer;

    const handleSessionStatus = sessionStatusToHandlerMap[status];
    handleSessionStatus(updateTimer);

    // Increment effectiveTimeOfStudy every second
    interval = setInterval(() => {
      handleEffectiveTimeOfStudyIncrease(updateTimer);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);
};

export default useEffectStatusHandling;
