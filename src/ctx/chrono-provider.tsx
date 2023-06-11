"use client";

import { createContext, useState, useEffect } from "react";

interface ChronoContext {
  sessionChrono: {
    seconds: number;
    isActive: boolean;
  };
  setSessionChrono: (sessionChrono: ChronoContext["sessionChrono"]) => void;
}

export const chronoCtxDefaultValues: ChronoContext = {
  sessionChrono: {
    seconds: 0,
    isActive: false,
  },
  setSessionChrono: () => {},
};

export const ChronoContext = createContext<ChronoContext>(
  chronoCtxDefaultValues
);

export default function ChronoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionChrono, setSessionChrono] = useState(
    chronoCtxDefaultValues.sessionChrono
  );

  // TODO: Needs improvement
  const showDesktopNotification = () => {
    new Notification("Hello World");
  };

  useEffect(() => {
    let interval: NodeJS.Timer;
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
