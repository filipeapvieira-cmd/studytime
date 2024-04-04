import { useEffect } from "react";
import {
  statusToHandler,
  handleEffectiveTimeOfStudyIncrease,
} from "@/lib/time-provider/utils";
import { SessionStatus, SessionTimer } from "@/types";

const useEffectStatusHandling = (
  status: SessionStatus,
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  useEffect(() => {
    let interval: NodeJS.Timer;
    //TODO: Replace setSessionTimer with updateSessionTimer
    const handleSessionStatus = statusToHandler[status];
    handleSessionStatus(updateSessionTimer);

    // Increment effectiveTimeOfStudy every second
    interval = setInterval(() => {
      handleEffectiveTimeOfStudyIncrease(updateSessionTimer);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);
};

export default useEffectStatusHandling;
