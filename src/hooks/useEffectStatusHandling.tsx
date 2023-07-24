import { useEffect, Dispatch, SetStateAction } from "react";
import { statusToHandler, handleInterval } from "@/lib/time-provider/utils";
import { SessionStatus, SessionTimer } from "@/types";

const useEffectStatusHandling = (
  status: SessionStatus,
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  useEffect(() => {
    let interval: NodeJS.Timer;

    const handler = statusToHandler[status];
    handler(sessionTimer, setSessionTimer);

    // increment study session time
    interval = setInterval(() => {
      handleInterval(sessionTimer, setSessionTimer);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);
};

export default useEffectStatusHandling;
