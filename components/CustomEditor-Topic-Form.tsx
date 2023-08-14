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
import { Topic } from "@/types";
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
import CustomTextArea from "./ui/CustomTextArea";

interface CustomEditorFormProps {
  topic: Topic;
}

interface CurrentTopic {
  title: string;
  hashtags: string;
  description: string;
}

const CustomEditorForm: FC<CustomEditorFormProps> = ({
  topic,
}: CustomEditorFormProps) => {
  const sessionStatus = useSessionStatus();
  const { setSessions } = useContext(SaveSessionContext);
  const { title, hashtags, description } = topic;
  const {
    effectiveTimeOfStudy,
    status,
    sessionStartTime,
    sessionEndTime,
    sessionPauseStartTime,
    sessionPauseEndTime,
    totalPauseTime,
  } = topic;
  const [currentTopic, setCurrentTopic] = useState<CurrentTopic>({
    title,
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
      setSessions((prevValue: Topic[]) =>
        handleReplaceTopic(prevValue, currentTopic)
      );
    }, 1000);
    return () => clearTimeout(delay);
  }, [currentTopic, setSessions]);

  useEffect(() => {
    setSessions((prevValue: Topic[]) =>
      handleTimerChange(prevValue, componentTimeState)
    );
  }, [componentTimeState]);

  const handleReplaceTopic = (
    allTopics: Topic[],
    currentTopic: CurrentTopic
  ) => {
    const topicToUpdate: Topic = allTopics.find(
      (currentTopic) => currentTopic.id === topic.id
    ) as Topic;

    const { title, description } = currentTopic;
    const hashtags = currentTopic.hashtags;

    const updatedTopic = { ...topicToUpdate, title, hashtags, description };

    return allTopics.map((currentTopic) => {
      if (currentTopic.id === topic.id) {
        return updatedTopic;
      } else {
        return topic;
      }
    });
  };

  const handleTimerChange = (
    allTopics: Topic[],
    componentTimeState: SessionTimer
  ) => {
    const topicToUpdate: Topic = allTopics.find(
      (currentTopic) => currentTopic.id === topic.id
    ) as Topic;

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

    return allTopics.map((currentTopic) => {
      if (currentTopic.id === topic.id) {
        return updatedTopic;
      } else {
        return topic;
      }
    });
  };

  const handleNewTopic = () => {
    setSessions((prevValue: Topic[]) => [...prevValue, createNewSession()]);
  };

  const handleDeleteTopic = () => {
    setSessions((prevValue: Topic[]) =>
      prevValue.filter((currentTopic) => currentTopic.id !== topic.id)
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
      <form className="pb-2">
        <div className="flex">
          <Input
            className="rounded-none w-1/3 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Subject"
            value={currentTopic.title}
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
        <CustomTextArea
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
