"use client";

import { createContext, useState, useEffect } from "react";

interface ChronoContext {
  seconds: number;
  setSeconds: (seconds: number) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const chronoContextValue: ChronoContext = {
  seconds: 0,
  setSeconds: () => {},
  isActive: false,
  setIsActive: () => {},
};

export const ChronoContext = createContext<ChronoContext>(chronoContextValue);

export default function ChronoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seconds, setSeconds] = useState(chronoContextValue.seconds);
  const [isActive, setIsActive] = useState(chronoContextValue.isActive);

  // TODO: Needs improvement
  const showDesktopNotification = () => {
    new Notification("Hello World");
  };

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds === 0) {
            showDesktopNotification();
            setIsActive(false);
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <ChronoContext.Provider
      value={{ seconds, setSeconds, isActive, setIsActive }}
    >
      {children}
    </ChronoContext.Provider>
  );
}
