"use client";

import { SessionStatusEnum } from "@/src/constants/config";
import { useTimeContext } from "@/src/ctx/time-provider";
import { updateTimerStatus } from "@/src/lib/time-provider/utils";
import BtnTimer from "./BtnTimer";

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
