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
} from "@/lib/time-provider/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./ui/BtnTimer";
import { SessionTimer } from "@/types";
import useEffectStatusHandling from "@/hooks/useEffectStatusHandling";

interface CustomEditorFormProps {
  session: SessionReport;
}

interface CurrentTopic {
  topic: string;
  hashtags: string[];
  description: string;
}

const CustomEditorForm: FC<CustomEditorFormProps> = ({
  session,
}: CustomEditorFormProps) => {
  //console.count(session.topic);
  //const { sessionTimer, setSessionTimer } = useContext(TimeContext);
  //const status = useMemo(() => sessionTimer.status, [sessionTimer.status]);
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
  console.log(componentTimeState);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSessions((prevValue: SessionReport[]) =>
        handleReplaceTopic(prevValue, currentTopic)
      );
    }, 1000);
    return () => clearTimeout(delay);
  }, [currentTopic, setSessions]);

  useEffect(() => {
    setSessions((prevValue: SessionReport[]) => handleUnmount(prevValue));
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

  const handleUnmount = (allTopics: SessionReport[]) => {
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
    const value =
      e.target.name !== "hashtags"
        ? e.target.value
        : [...e.target.value.split(" ")];

    setCurrentTopic((prevValue) => ({
      ...prevValue,
      [e.target.name]: value,
    }));
  };

  useEffectStatusHandling(
    componentTimeState.status,
    componentTimeState,
    setComponentTimeState
  );

  return (
    <>
      <form>
        <div className="flex">
          <Input
            placeholder="Subject"
            value={currentTopic.topic}
            name="topic"
            onChange={(e) => handleInputChange(e)}
          />
          <Input
            placeholder="Hashtags"
            value={currentTopic.hashtags.join(" ")}
            name="hashtags"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <textarea
          rows={10}
          className="w-full"
          value={currentTopic.description}
          name="description"
          onChange={(e) => handleInputChange(e)}
        />
      </form>
      <Button onClick={handleNewTopic}>New Topic</Button>
      <Button onClick={handleDeleteTopic}>Delete</Button>
      <BtnTimer
        status={componentTimeState.status}
        effectiveTimeOfStudy={componentTimeState.effectiveTimeOfStudy}
        onClick={() =>
          handleState(componentTimeState.status, setComponentTimeState)
        }
      />
    </>
  );
};

export default CustomEditorForm;
