"use client";

import { useTimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./BtnTimer";
import { updateSessionTimerStatus } from "@/lib/time-provider/utils";
import { SessionStatusEnum } from "@/constants/config";

const Timer = () => {
  const { sessionTimer, updateSessionTimer } = useTimeContext();
  const { effectiveTimeOfStudy, status } = sessionTimer;

  return (
    <BtnTimer
      onClick={() => updateSessionTimerStatus(status, updateSessionTimer)}
      status={status}
      effectiveTimeOfStudy={effectiveTimeOfStudy}
      disabled={status === SessionStatusEnum.Stop}
    />
  );
};

export default Timer;
