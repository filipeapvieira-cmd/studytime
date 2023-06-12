"use client";

import { createContext, useState, useEffect } from "react";
import { TimeContextType } from "@/types";

export const timeCtxDefaultValues: TimeContextType = {
  sessionTimer: {
    currentTimeOfStudy: 0,
    status: "initial",
  },
  setSessionTimer: () => {}, // provide a default function
};

export const TimeContext = createContext(timeCtxDefaultValues);

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionTimer, setSessionTimer] = useState<
    TimeContextType["sessionTimer"]
  >(timeCtxDefaultValues.sessionTimer);

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (
      sessionTimer.status === "initial" ||
      sessionTimer.status === "pause" ||
      sessionTimer.status === "stop"
    ) {
      return;
    }

    interval = setInterval(() => {
      setSessionTimer((prevSessionTimer) => ({
        ...prevSessionTimer,
        currentTimeOfStudy: prevSessionTimer.currentTimeOfStudy + 1,
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sessionTimer.status]);

  return (
    <TimeContext.Provider value={{ sessionTimer, setSessionTimer }}>
      {children}
    </TimeContext.Provider>
  );
}
