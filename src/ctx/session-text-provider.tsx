"use client";

import React, { createContext } from "react";

interface SessionTextContextProps {
  sessionText: string;
  setSessionText: (sessionText: string) => void;
  sessionTextUpdate: string;
  setSessionTextUpdate: React.Dispatch<React.SetStateAction<string>>;
}

export const sessionTextCtxDefaultValues: SessionTextContextProps = {
  sessionText: `----------\n### **Content**\n#### @[Main Subject - Topic]\n- Action 1\n----------\n### **Feelings**\n- This session...`,
  setSessionText: () => {},
  sessionTextUpdate: "",
  setSessionTextUpdate: () => {},
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
  const [sessionTextUpdate, setSessionTextUpdate] = React.useState("");

  return (
    <SessionTextContext.Provider
      value={{
        sessionText,
        setSessionText,
        sessionTextUpdate,
        setSessionTextUpdate,
      }}
    >
      {children}
    </SessionTextContext.Provider>
  );
}
