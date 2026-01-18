import { useEffect } from "react";
import {
  handleEffectiveTimeOfStudyIncrease,
  statusToUpdateHandlerMap,
} from "@/src/lib/time-provider/utils";
import type { SessionStatus, Timer } from "@/src/types";

// Used to handle the status update of Sessions and Topics
const useEffectStatusHandling = (
  status: SessionStatus,
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  useEffect(() => {
    let interval: NodeJS.Timer;

    const handleStatusUpdate = statusToUpdateHandlerMap[status];
    handleStatusUpdate(updateTimer);

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
