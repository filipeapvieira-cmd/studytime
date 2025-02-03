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
import { createNewTopic } from "./session-topics-provider";

type UpdateSessionError = {
  startTime: boolean;
  endTime: boolean;
  pauseDuration: boolean;
  effectiveTime: boolean;
};

const initialErrorState: UpdateSessionError = {
  startTime: false,
  endTime: false,
  pauseDuration: false,
  effectiveTime: false,
};

type StudySessionContextType = {
  sessionToEdit: StudySessionDto | null;
  setSessionToEdit: Dispatch<SetStateAction<StudySessionDto | null>>;

  sessionTopicsUpdate: Topic[];
  setSessionTopicsUpdate: Dispatch<SetStateAction<Topic[]>>;

  sessionFeelingsUpdate: string;
  setSessionFeelingsUpdate: Dispatch<SetStateAction<string>>;

  error: UpdateSessionError;
  setError: Dispatch<SetStateAction<UpdateSessionError>>;

  resetUpdateSessionCtxState: () => void;
};

const StudySessionContext = createContext<StudySessionContextType | null>(null);

export function UpdateSessionProvider({ children }: { children: ReactNode }) {
  const [sessionToEdit, setSessionToEdit] = useState<StudySessionDto | null>(
    null
  );
  const [sessionTopicsUpdate, setSessionTopicsUpdate] = useState<Topic[]>([]);
  const [sessionFeelingsUpdate, setSessionFeelingsUpdate] =
    useState<string>("");
  const [error, setError] = useState<UpdateSessionError>(initialErrorState);

  const resetUpdateSessionCtxState = () => {
    setSessionToEdit(null);
    setSessionTopicsUpdate([createNewTopic()]);
    setSessionFeelingsUpdate("");
    setError(initialErrorState);
  };

  return (
    <StudySessionContext.Provider
      value={{
        sessionToEdit,
        setSessionToEdit,
        sessionTopicsUpdate,
        setSessionTopicsUpdate,
        sessionFeelingsUpdate,
        setSessionFeelingsUpdate,
        error,
        setError,
        resetUpdateSessionCtxState,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
}

export function useUpdateSessionContext() {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error(
      "useStudySessionContext must be used within a UpdateSessionProvider."
    );
  }
  return context;
}
