"use client";

import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Topic, Session } from "@/types";

//TODO: rename this method to createNewTopic
export const createNewSession = (): Topic => ({
  id: uuidv4(),
  title: "",
  hashtags: "",
  description: "",
  effectiveTimeOfStudy: 0,
  status: "initial",
  sessionStartTime: 0,
  sessionEndTime: 0,
  sessionPauseStartTime: 0,
  sessionPauseEndTime: 0,
  totalPauseTime: 0,
});

export const newSessionCtxDefaultValues: Session = {
  sessions: [createNewSession()],
  setSessions: () => [],
};

export const SaveSessionContext = createContext(newSessionCtxDefaultValues);

interface SaveSessionProvider {
  children: React.ReactNode;
}

// Handles Topics
//TODO: rename [sessionsReport, setSessionsReport] appropriately
export default function SaveSessionProvider({ children }: SaveSessionProvider) {
  const [sessionsReport, setSessionsReport] = useState<Topic[]>(
    newSessionCtxDefaultValues.sessions
  );

  useEffect(() => {
    if (sessionsReport.length === 0) {
      setSessionsReport(newSessionCtxDefaultValues.sessions);
    }
  }, [sessionsReport]);

  return (
    <SaveSessionContext.Provider
      value={{ sessions: sessionsReport, setSessions: setSessionsReport }}
    >
      {children}
    </SaveSessionContext.Provider>
  );
}
