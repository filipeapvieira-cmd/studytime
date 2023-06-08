"use client";

import TimerProvider from "@/src/ctx/time-provider";

import { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return <TimerProvider>{children}</TimerProvider>;
};

export default Providers;
