"use client";

import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Topic, studySessionDto } from "@/types";

interface TopicsContextProps {
  sessionTopics: Topic[];
  setSessionTopics: Dispatch<SetStateAction<Topic[]>>;
  sessionTopicsUpdate: studySessionDto[];
  setSessionTopicsUpdate: Dispatch<SetStateAction<studySessionDto[]>>;
}

export const createNewTopic = (): Topic => ({
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

export const topicsCtxDefaultValues: TopicsContextProps = {
  sessionTopics: [createNewTopic()],
  setSessionTopics: () => [],
  sessionTopicsUpdate: [],
  setSessionTopicsUpdate: () => [],
};

export const TopicsContext = createContext(topicsCtxDefaultValues);

interface SaveSessionProvider {
  children: React.ReactNode;
}

export default function TopicsProvider({ children }: SaveSessionProvider) {
  const [sessionTopics, setSessionTopics] = useState<Topic[]>(
    topicsCtxDefaultValues.sessionTopics
  );
  const [sessionTopicsUpdate, setSessionTopicsUpdate] =
    useState<studySessionDto[]>(null);

  useEffect(() => {
    console.log("TopicsProvider State changed:");
    console.log(sessionTopics);
    if (sessionTopics.length === 0) {
      setSessionTopics(topicsCtxDefaultValues.sessionTopics);
    }
  }, [sessionTopics]);

  return (
    <TopicsContext.Provider
      value={{
        sessionTopics,
        setSessionTopics,
        sessionTopicsUpdate,
        setSessionTopicsUpdate,
      }}
    >
      {children}
    </TopicsContext.Provider>
  );
}
