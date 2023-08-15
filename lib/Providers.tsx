"use client";

import { SessionProvider } from "next-auth/react";
import TimerProvider from "@/src/ctx/time-provider";
import ChronoProvider from "@/src/ctx/chrono-provider";
import FeelingsProvider from "@/src/ctx/session-feelings-provider";
import UploadImagesProvider from "@/src/ctx/upload-images-provider";
import TopicsProvider from "@/src/ctx/session-topics-provider";
import { ThemeProvider } from "next-themes";
import { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <SessionProvider>
        <TopicsProvider>
          <TimerProvider>
            <ChronoProvider>
              <FeelingsProvider>
                <UploadImagesProvider>{children}</UploadImagesProvider>
              </FeelingsProvider>
            </ChronoProvider>
          </TimerProvider>
        </TopicsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
