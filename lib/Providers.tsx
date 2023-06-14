"use client";

import TimerProvider from "@/src/ctx/time-provider";
import ChronoProvider from "@/src/ctx/chrono-provider";
import SessionTextProvider from "@/src/ctx/session-text-provider";
import UploadImagesProvider from "@/src/ctx/upload-images-provider";

import { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <TimerProvider>
      <ChronoProvider>
        <SessionTextProvider>
          <UploadImagesProvider>{children}</UploadImagesProvider>
        </SessionTextProvider>
      </ChronoProvider>
    </TimerProvider>
  );
};

export default Providers;
