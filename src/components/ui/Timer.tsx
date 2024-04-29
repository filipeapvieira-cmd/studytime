"use client";

import { useTimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./BtnTimer";
import { updateTimerStatus } from "@/src/lib/time-provider/utils";
import { SessionStatusEnum } from "@/src/constants/config";

const Timer = () => {
  const { sessionTimer, updateSessionTimer } = useTimeContext();
  const { effectiveTimeOfStudy, status } = sessionTimer;

  return (
    <BtnTimer
      onClick={() => updateTimerStatus(status, updateSessionTimer)}
      status={status}
      effectiveTimeOfStudy={effectiveTimeOfStudy}
      disabled={status === SessionStatusEnum.Stop}
    />
  );
};

export default Timer;
