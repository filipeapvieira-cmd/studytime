"use client";

import { createContext, useState, useEffect } from "react";
import { SessionTimer, TimeContextType, SessionStatus } from "@/types";
import {
  handleInitial,
  handlePause,
  handleStop,
  handlePlay,
  handleInterval,
} from "@/lib/time-provider/utils";

export const timeCtxDefaultValues: TimeContextType = {
  sessionTimer: {
    effectiveTimeOfStudy: 0,
    status: "initial",
    sessionStartTime: 0,
    sessionEndTime: 0,
    sessionPauseStartTime: 0,
    sessionPauseEndTime: 0,
    totalPauseTime: 0,
  },
  setSessionTimer: () => {},
  getLastSessionTimer: () => timeCtxDefaultValues.sessionTimer,
  status: "initial",
};

export const TimeContext = createContext(timeCtxDefaultValues);

const statusToHandler = {
  initial: handleInitial,
  pause: handlePause,
  stop: handleStop,
  play: handlePlay,
};

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionTimer, setSessionTimer] = useState<SessionTimer>(
    timeCtxDefaultValues.sessionTimer
  );
  const { status } = sessionTimer;

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

  const getLastSessionTimer = () => {
    return sessionTimer;
  };

  return (
    <TimeContext.Provider
      value={{
        status,
        sessionTimer,
        setSessionTimer,
        getLastSessionTimer,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
