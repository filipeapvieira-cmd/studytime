"use client";

import { createContext, useState, useContext } from "react";
import { Timer, TimeContextType, SessionStatus } from "@/src/types";
import useEffectStatusHandling from "@/hooks/useEffectStatusHandling";

export const timeCtxDefaultValues: TimeContextType = {
  Timer: {
    effectiveTimeOfStudy: 0,
    status: "initial",
    startTime: 0,
    endTime: 0,
    pauseStartTime: 0,
    pauseEndTime: 0,
    totalPauseTime: 0,
  },
  getLastTimer: () => timeCtxDefaultValues.Timer,
  status: "initial",
  updateTimer: () => {},
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
  const [Timer, setTimer] = useState<Timer>(timeCtxDefaultValues.Timer);
  const { status } = Timer;

  const updateTimer = (updateFunction: (prev: Timer) => Timer) => {
    setTimer((prev) => updateFunction(prev));
  };

  useEffectStatusHandling(status, updateTimer);

  const getLastTimer = () => {
    return Timer;
  };

  return (
    <TimeContext.Provider
      value={{
        status,
        Timer,
        updateTimer,
        getLastTimer,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
