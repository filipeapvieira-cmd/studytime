"use client";

import React, { createContext } from "react";

interface FeelingsContextProps {
  sessionFeelings: string;
  setSessionFeelings: React.Dispatch<React.SetStateAction<string>>;
  sessionFeelingsUpdate: string;
  setSessionFeelingsUpdate: React.Dispatch<React.SetStateAction<string>>;
}

export const feelingsCtxDefaultValues: FeelingsContextProps = {
  sessionFeelings: "",
  setSessionFeelings: () => {},
  sessionFeelingsUpdate: "",
  setSessionFeelingsUpdate: () => {},
};

export const FeelingsContext = createContext(feelingsCtxDefaultValues);

// Handles Feelings
export default function FeelingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionFeelings, setSessionFeelings] = React.useState(
    feelingsCtxDefaultValues.sessionFeelings,
  );
  const [sessionFeelingsUpdate, setSessionFeelingsUpdate] = React.useState(
    feelingsCtxDefaultValues.sessionFeelings,
  );

  return (
    <FeelingsContext.Provider
      value={{
        sessionFeelings,
        setSessionFeelings,
        sessionFeelingsUpdate,
        setSessionFeelingsUpdate,
      }}
    >
      {children}
    </FeelingsContext.Provider>
  );
}
