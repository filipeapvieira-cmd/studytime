"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { FC } from "react";
import BeforeUnloadHandler from "@/src/components/layout/BeforeUnloadHandler";
import ChronoProvider from "@/src/ctx/chrono-provider";
import FeelingsProvider from "@/src/ctx/session-feelings-provider";
import TopicsProvider from "@/src/ctx/session-topics-provider";
import TimerProvider from "@/src/ctx/time-provider";
import UploadImagesProvider from "@/src/ctx/upload-images-provider";
import { UpdateSessionProvider } from "../ctx/update-session-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
      <SessionProvider>
        <TopicsProvider>
          <TimerProvider>
            <ChronoProvider>
              <FeelingsProvider>
                <UploadImagesProvider>
                  <UpdateSessionProvider>{children}</UpdateSessionProvider>
                </UploadImagesProvider>
              </FeelingsProvider>
            </ChronoProvider>
            <BeforeUnloadHandler />
          </TimerProvider>
        </TopicsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
