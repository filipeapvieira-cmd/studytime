"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { Topic } from "@/src/types";

interface TopicsContextProps {
  sessionTopics: Topic[];
  setSessionTopics: Dispatch<SetStateAction<Topic[]>>;
  sessionTopicsUpdate: Topic[];
  setSessionTopicsUpdate: Dispatch<SetStateAction<Topic[]>>;
}

export const createNewTopic = (): Topic => ({
  id: uuidv4(),
  title: "",
  hashtags: "",
  description: "",
  effectiveTimeOfStudy: 0,
  status: "initial",
  startTime: 0,
  endTime: 0,
  pauseStartTime: 0,
  pauseEndTime: 0,
  totalPauseTime: 0,
  contentJson: { blocks: [] },
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
    topicsCtxDefaultValues.sessionTopics,
  );
  const [sessionTopicsUpdate, setSessionTopicsUpdate] = useState<Topic[]>(
    topicsCtxDefaultValues.sessionTopics,
  );

  useEffect(() => {
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
