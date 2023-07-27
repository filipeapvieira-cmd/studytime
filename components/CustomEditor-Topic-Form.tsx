"use client";

import {
  FC,
  useContext,
  ChangeEvent,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SessionReport } from "@/types";
import { SaveSessionContext } from "@/ctx/save-session-provider";
import { createNewSession } from "@/ctx/save-session-provider";
import {
  handleState,
  statusToHandler,
  handleInterval,
  handlePause,
  handleStop,
  coerceComponentState,
} from "@/lib/time-provider/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./ui/BtnTimer";
import { SessionTimer } from "@/types";
import useEffectStatusHandling from "@/hooks/useEffectStatusHandling";
import useSessionStatus from "@/src/hooks/useSessionStatus";

interface CustomEditorFormProps {
  session: SessionReport;
}

interface CurrentTopic {
  topic: string;
  hashtags: string;
  description: string;
}

const CustomEditorForm: FC<CustomEditorFormProps> = ({
  session,
}: CustomEditorFormProps) => {
  const sessionStatus = useSessionStatus();
  const { setSessions } = useContext(SaveSessionContext);
  const { topic, hashtags, description } = session;
  const {
    effectiveTimeOfStudy,
    status,
    sessionStartTime,
    sessionEndTime,
    sessionPauseStartTime,
    sessionPauseEndTime,
    totalPauseTime,
  } = session;
  const [currentTopic, setCurrentTopic] = useState<CurrentTopic>({
    topic,
    hashtags,
    description,
  });
  const [componentTimeState, setComponentTimeState] = useState<SessionTimer>({
    effectiveTimeOfStudy,
    status,
    sessionStartTime,
    sessionEndTime,
    sessionPauseStartTime,
    sessionPauseEndTime,
    totalPauseTime,
  });

  useEffect(() => {
    coerceComponentState(
      sessionStatus,
      componentTimeState.status,
      setComponentTimeState
    );
  }, [sessionStatus]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSessions((prevValue: SessionReport[]) =>
        handleReplaceTopic(prevValue, currentTopic)
      );
    }, 1000);
    return () => clearTimeout(delay);
  }, [currentTopic, setSessions]);

  useEffect(() => {
    setSessions((prevValue: SessionReport[]) =>
      handleTimerChange(prevValue, componentTimeState)
    );
  }, [componentTimeState]);

  const handleReplaceTopic = (
    allTopics: SessionReport[],
    currentTopic: CurrentTopic
  ) => {
    const topicToUpdate: SessionReport = allTopics.find(
      (topic) => topic.id === session.id
    ) as SessionReport;

    const { topic, description } = currentTopic;
    const hashtags = currentTopic.hashtags;

    const updatedTopic = { ...topicToUpdate, topic, hashtags, description };

    return allTopics.map((topic) => {
      if (topic.id === session.id) {
        return updatedTopic;
      } else {
        return topic;
      }
    });
  };

  const handleTimerChange = (
    allTopics: SessionReport[],
    componentTimeState: SessionTimer
  ) => {
    const topicToUpdate: SessionReport = allTopics.find(
      (topic) => topic.id === session.id
    ) as SessionReport;

    const {
      effectiveTimeOfStudy,
      status,
      sessionStartTime,
      sessionEndTime,
      sessionPauseStartTime,
      sessionPauseEndTime,
      totalPauseTime,
    } = componentTimeState;

    const updatedTopic = {
      ...topicToUpdate,
      effectiveTimeOfStudy,
      status,
      sessionStartTime,
      sessionEndTime,
      sessionPauseStartTime,
      sessionPauseEndTime,
      totalPauseTime,
    };

    return allTopics.map((topic) => {
      if (topic.id === session.id) {
        return updatedTopic;
      } else {
        return topic;
      }
    });
  };

  const handleNewTopic = () => {
    setSessions((prevValue: SessionReport[]) => [
      ...prevValue,
      createNewSession(),
    ]);
  };

  const handleDeleteTopic = () => {
    setSessions((prevValue: SessionReport[]) =>
      prevValue.filter((currentSession) => currentSession.id !== session.id)
    );
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentTopic((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  useEffectStatusHandling(
    componentTimeState.status,
    componentTimeState,
    setComponentTimeState
  );

  return (
    <>
      <form className="p-2">
        <div className="flex">
          <Input
            className="rounded-none w-1/3 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Subject"
            value={currentTopic.topic}
            name="topic"
            onChange={(e) => handleInputChange(e)}
          />
          <Input
            className="rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Hashtags"
            value={currentTopic.hashtags}
            name="hashtags"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <textarea
          rows={10}
          className="w-full outline-0 p-1 bg-secondary caret-foreground border-input border"
          value={currentTopic.description}
          name="description"
          onChange={(e) => handleInputChange(e)}
        />
      </form>
      <div className="flex space-x-1">
        <Button onClick={handleNewTopic} size="sm">
          New Topic
        </Button>
        <Button onClick={handleDeleteTopic} variant="destructive" size="sm">
          Delete
        </Button>
        <BtnTimer
          size="sm"
          disabled={status === "stop" || sessionStatus !== "play"}
          status={componentTimeState.status}
          effectiveTimeOfStudy={componentTimeState.effectiveTimeOfStudy}
          onClick={() =>
            handleState(componentTimeState.status, setComponentTimeState)
          }
        />
      </div>
    </>
  );
};

export default CustomEditorForm;
