"use client";

import { createContext, useState, useEffect } from "react";
import { SessionTimer, TimeContextType } from "@/types";
import { calcSessionTimes } from "@/lib/utils";

export const timeCtxDefaultValues: TimeContextType = {
  sessionTimer: {
    effectiveTimeOfStudy: 0,
    status: "initial",
    sessionStartTime: 0,
    sessionEndTime: 0,
    sessionPauseStartTime: 0,
    sessionPauseEndTime:0,
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

  console.log(sessionTimer);
  const { effectiveTimeOfStudy, status, sessionStartTime } = sessionTimer;

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (status === "initial") {
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

    if (status === "pause" && sessionStartTime === 0) {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        sessionPauseStartTime: Date.now(),
      }));
    }
    // if pause and startpausetime === 0
    // set startpausetime: date.now
    

    // set study session start time
    if (sessionStartTime === 0) {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        sessionStartTime: Date.now(),
      }));
    }

    // increment study session time
    interval = setInterval(() => {
      // if pausestarttime !== 0
      // set pauseendtime: date.now
      // set totalpause time = end - start
      // set end and start to 0

      setSessionTimer((prevSessionTimer) => ({
          ...prevSessionTimer,
      }));

      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        //effectiveTimeOfStudy: prevSessionTimer.effectiveTimeOfStudy + 1,
        effectiveTimeOfStudy: Date.now() - (prevSessionTimer.sessionStartTime + prevSessionTimer.totalPauseTime),
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
