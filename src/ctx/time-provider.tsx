"use client";

import { createContext, useState, useContext } from "react";
import { SessionTimer, TimeContextType, SessionStatus } from "@/src/types";
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
  getLastSessionTimer: () => timeCtxDefaultValues.sessionTimer,
  status: "initial",
  updateSessionTimer: () => {},
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

  const updateSessionTimer = (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => {
    setSessionTimer((prev) => updateFunction(prev));
  };

  useEffectStatusHandling(status, updateSessionTimer);

  const getLastSessionTimer = () => {
    return sessionTimer;
  };

  return (
    <TimeContext.Provider
      value={{
        status,
        sessionTimer,
        updateSessionTimer,
        getLastSessionTimer,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
