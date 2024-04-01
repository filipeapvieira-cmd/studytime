"use client";

import { createContext, useState, useContext } from "react";
import { SessionTimer, TimeContextType, SessionStatus } from "@/types";
import {
  handleInitial,
  handlePause,
  handleStop,
  handlePlay,
  handleInterval,
  statusToHandler,
} from "@/lib/time-provider/utils";
import useEffectStatusHandling from "@/hooks/useEffectStatusHandling";

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

export const useTimeContext = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error("useTimeContext must be used within a TimerProvider");
  }
  return context;
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

  useEffectStatusHandling(status, sessionTimer, setSessionTimer);

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
