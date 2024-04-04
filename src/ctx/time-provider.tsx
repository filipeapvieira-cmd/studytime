"use client";

import { createContext, useState, useContext } from "react";
import { SessionTimer, TimeContextType, SessionStatus } from "@/types";
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
  // Objective is to replace setSessionTimer with updateSessionTimer
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

  //TODO: Continue to replace setSessionTimer with updateSessionTimer

  const getLastSessionTimer = () => {
    return sessionTimer;
  };

  return (
    <TimeContext.Provider
      value={{
        status,
        sessionTimer,
        setSessionTimer,
        updateSessionTimer,
        getLastSessionTimer,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
