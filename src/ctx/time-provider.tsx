"use client";

import { createContext, useState } from "react";
import { SessionTimer } from "@/types";

interface TimeContextProps {
  sessionStartTime: number;
  setSessionStartTime: (startTime: number) => void;

  counterDuration: number;
  setCounterDuration: (duration: number) => void;
}

const timeContextValue: TimeContextProps = {
  sessionStartTime: 0,
  setSessionStartTime: (startTime: number) => {},

  counterDuration: 0,
  setCounterDuration: (duration: number) => {},
};

export const TimeContext = createContext(timeContextValue);

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [counterDuration, setCounterDuration] = useState<number>(0);

  return (
    <TimeContext.Provider
      value={{
        sessionStartTime,
        setSessionStartTime,
        counterDuration,
        setCounterDuration,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
