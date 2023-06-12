"use client";

import { createContext, useState, useEffect } from "react";
import { SessionTimer, TimeContextType } from "@/types";
import { calcSessionTimes } from "@/lib/utils";

export const timeCtxDefaultValues: TimeContextType = {
  sessionTimer: {
    currentTimeOfStudy: 0,
    status: "initial",
    sessionStartTime: 0,
    sessionEndTime: 0,
    totalPauseTime: 0,
  },
  setSessionTimer: () => {}, // provide a default function
};

export const TimeContext = createContext(timeCtxDefaultValues);

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionTimer, setSessionTimer] = useState<SessionTimer>(
    timeCtxDefaultValues.sessionTimer
  );
  const { currentTimeOfStudy, status, sessionStartTime } = sessionTimer;

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (status === "initial" || status === "pause") {
      return;
    }

    // set study session end time and pause time
    if (status === "stop") {
      const { sessionEndTime, totalPauseTime } = calcSessionTimes(sessionTimer);
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        sessionEndTime,
        totalPauseTime,
      }));
      return;
    }

    // set study session start time
    if (sessionStartTime === 0) {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        sessionStartTime: Date.now(),
      }));
    }

    // increment study session time
    interval = setInterval(() => {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        currentTimeOfStudy: prevSessionTimer.currentTimeOfStudy + 1,
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return (
    <TimeContext.Provider value={{ sessionTimer, setSessionTimer }}>
      {children}
    </TimeContext.Provider>
  );
}
