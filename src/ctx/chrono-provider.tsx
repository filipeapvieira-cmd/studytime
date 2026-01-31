"use client";

import { createContext, useEffect, useState } from "react";
import type { ChronoContextType } from "@/src/types";

export const chronoCtxDefaultValues: ChronoContextType = {
  sessionChrono: {
    seconds: 0,
    isActive: false,
  },
  setSessionChrono: () => { },
};

export const ChronoContext = createContext<ChronoContextType>(
  chronoCtxDefaultValues,
);

export default function ChronoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionChrono, setSessionChrono] = useState(
    chronoCtxDefaultValues.sessionChrono,
  );

  // TODO: Needs improvement
  const showDesktopNotification = () => {
    new Notification("Hello World");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionChrono.isActive) {
      interval = setInterval(() => {
        setSessionChrono((prevSessionChrono) => {
          if (prevSessionChrono.seconds === 0) {
            showDesktopNotification();
            return chronoCtxDefaultValues.sessionChrono;
          }
          return {
            ...prevSessionChrono,
            seconds: prevSessionChrono.seconds - 1,
          };
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [sessionChrono.isActive]);

  return (
    <ChronoContext.Provider value={{ sessionChrono, setSessionChrono }}>
      {children}
    </ChronoContext.Provider>
  );
}
