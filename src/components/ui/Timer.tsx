"use client";

import { useTimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./BtnTimer";
import { updateTimerStatus } from "@/src/lib/time-provider/utils";
import { SessionStatusEnum } from "@/src/constants/config";

const Timer = () => {
  const { Timer, updateTimer } = useTimeContext();
  const { effectiveTimeOfStudy, status } = Timer;

  return (
    <BtnTimer
      onClick={() => updateTimerStatus(status, updateTimer)}
      status={status as SessionStatusEnum}
      effectiveTimeOfStudy={effectiveTimeOfStudy}
      disabled={status === SessionStatusEnum.Stop}
    />
  );
};

export default Timer;
