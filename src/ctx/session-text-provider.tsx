"use client";

import React, { createContext } from "react";

interface SessionTextContextProps {
  sessionText: string;
  setSessionText: (sessionText: string) => void;
}

export const sessionTextCtxDefaultValues: SessionTextContextProps = {
  sessionText: `----------\n### **Content**\n#### @[Main Subject - Topic]\n- Action 1\n----------\n### **Feelings**\n- This session...`,
  setSessionText: () => {},
};

export const SessionTextContext = createContext(sessionTextCtxDefaultValues);

export default function SessionTextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionText, setSessionText] = React.useState(
    sessionTextCtxDefaultValues.sessionText
  );
  return (
    <SessionTextContext.Provider value={{ sessionText, setSessionText }}>
      {children}
    </SessionTextContext.Provider>
  );
}
