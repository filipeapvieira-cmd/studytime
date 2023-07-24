"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { TimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./BtnTimer";
import { handleState } from "@/lib/time-provider/utils";

const Timer = () => {
  const { sessionTimer, setSessionTimer } = useContext(TimeContext);
  const { effectiveTimeOfStudy, status } = sessionTimer;

  return (
    <>
      <BtnTimer
        onClick={() => handleState(status, setSessionTimer)}
        status={status}
        effectiveTimeOfStudy={effectiveTimeOfStudy}
        disabled={status === "stop"}
      />
    </>
  );
};

export default Timer;
