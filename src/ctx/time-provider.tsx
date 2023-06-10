"use client";

import { createContext, useState } from "react";

interface TimeContextProps {
  sessionTimer: {
    currentTimeOfStudy: number;
    status: "play" | "pause" | "stop" | "initial";
    lastUpdate: number;
  };
  setSessionTimer: (sessionTimer: TimeContextProps["sessionTimer"]) => void;
}

const timeContextValue: TimeContextProps = {
  sessionTimer: {
    currentTimeOfStudy: 0,
    status: "initial",
    lastUpdate: 0,
  },
  setSessionTimer: () => {}, // provide a default function
};

export const TimeContext = createContext(timeContextValue);

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionTimer, setSessionTimer] = useState(
    timeContextValue.sessionTimer
  );

  return (
    <TimeContext.Provider value={{ sessionTimer, setSessionTimer }}>
      {children}
    </TimeContext.Provider>
  );
}
