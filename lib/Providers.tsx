"use client";

import { SessionProvider } from "next-auth/react";
import TimerProvider from "@/src/ctx/time-provider";
import ChronoProvider from "@/src/ctx/chrono-provider";
import SessionTextProvider from "@/src/ctx/session-text-provider";
import UploadImagesProvider from "@/src/ctx/upload-images-provider";
import EditSessionProvider from "@/src/ctx/edit-sessions-provider";
import SaveSessionProvider from "@/ctx/save-session-provider";
import { ThemeProvider } from "next-themes";
import { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <SessionProvider>
        <SaveSessionProvider>
          <EditSessionProvider>
            <TimerProvider>
              <ChronoProvider>
                <SessionTextProvider>
                  <UploadImagesProvider>{children}</UploadImagesProvider>
                </SessionTextProvider>
              </ChronoProvider>
            </TimerProvider>
          </EditSessionProvider>
        </SaveSessionProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
