"use client";

import { createContext, useState, useEffect } from "react";
import { SessionTimer, TimeContextType } from "@/types";

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

    if (status === "pause") {
      if (sessionTimer.sessionPauseStartTime === 0) {
        setSessionTimer({
          ...sessionTimer,
          sessionPauseStartTime: Date.now(),
        });
      }
      return;
    } 

    // set study session end time and pause time
    if (status === "stop") {
      setSessionTimer((prevSessionTimer) => {
        console.log(prevSessionTimer.effectiveTimeOfStudy);
        console.log(Date.now() - (prevSessionTimer.sessionStartTime + prevSessionTimer.totalPauseTime));
        return {
          ...prevSessionTimer,
          sessionEndTime: Date.now(),
        }        
      });
      return;
    }

    // set study session start time
    if (sessionStartTime === 0) {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        sessionStartTime: Date.now(),
      }));
    }

    // set study session pause time
    if (status==="play" && sessionTimer.sessionPauseStartTime !== 0) {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        totalPauseTime: prevSessionTimer.totalPauseTime + (Date.now() - prevSessionTimer.sessionPauseStartTime),
        sessionPauseStartTime: 0,
      }));
    }

    // increment study session time
    interval = setInterval(() => {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
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
