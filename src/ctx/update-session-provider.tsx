"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { StudySessionDto, Topic } from "../types";

type StudySessionContextType = {
  sessionToEdit: StudySessionDto | null;
  setSessionToEdit: Dispatch<SetStateAction<StudySessionDto | null>>;

  sessionTopicsUpdate: Topic[];
  setSessionTopicsUpdate: Dispatch<SetStateAction<Topic[]>>;

  sessionFeelingsUpdate: string;
  setSessionFeelingsUpdate: Dispatch<SetStateAction<string>>;
};

const StudySessionContext = createContext<StudySessionContextType | null>(null);

export function UpdateSessionProvider({ children }: { children: ReactNode }) {
  const [sessionToEdit, setSessionToEdit] = useState<StudySessionDto | null>(
    null
  );
  const [sessionTopicsUpdate, setSessionTopicsUpdate] = useState<Topic[]>([]);
  const [sessionFeelingsUpdate, setSessionFeelingsUpdate] =
    useState<string>("");

  return (
    <StudySessionContext.Provider
      value={{
        sessionToEdit,
        setSessionToEdit,
        sessionTopicsUpdate,
        setSessionTopicsUpdate,
        sessionFeelingsUpdate,
        setSessionFeelingsUpdate,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
}

export function useStudySessionContext() {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error(
      "useStudySessionContext must be used within a UpdateSessionProvider."
    );
  }
  return context;
}
