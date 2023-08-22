"use client";

import {
  FC,
  useContext,
  ChangeEvent,
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Topic } from "@/types";
import {
  TopicsContext,
  createNewTopic,
} from "@/src/ctx/session-topics-provider";
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
import { timeStringToMillis } from "@/lib/session-log/update-utils";

interface CustomEditorFormProps {
  isUpdate: boolean;
  topic: Topic;
  setSessionTopics: Dispatch<SetStateAction<Topic[]>>;
}

interface CurrentTopic {
  title: string;
  hashtags: string;
  description: string;
}

const CustomEditorForm: FC<CustomEditorFormProps> = ({
  isUpdate,
  topic,
  setSessionTopics,
}: CustomEditorFormProps) => {
  const { sessionTopics } = useContext(TopicsContext);
  const sessionStatus = useSessionStatus();
  const {
    title,
    hashtags,
    description,
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
  const [userUpdatedEffectiveTimeOfStudy, setUserUpdatedEffectiveTimeOfStudy] =
    useState(
      String(
        new Date(componentTimeState.effectiveTimeOfStudy)
          .toISOString()
          .slice(11, 19)
      )
    );

  useEffect(() => {
    coerceComponentState(
      sessionStatus,
      componentTimeState.status,
      setComponentTimeState
    );
  }, [sessionStatus]);

  useEffect(() => {
    setSessionTopics((prevValue: Topic[]) =>
      handleTimerChange(prevValue, componentTimeState)
    );
  }, [componentTimeState]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSessionTopics((prevValue: Topic[]) =>
        handleTopicUpdate(prevValue, currentTopic)
      );
    }, 1000);
    return () => clearTimeout(delay);
  }, [currentTopic, setSessionTopics]);

  const handleTopicUpdate = (
    allTopics: Topic[],
    updatedTopicInformation: CurrentTopic
  ) => {
    const topicToUpdate: Topic = allTopics.find(
      (currentTopic) => currentTopic.id === topic.id
    ) as Topic;

    const { title, description } = updatedTopicInformation;
    const hashtags = updatedTopicInformation.hashtags;

    const updatedTopic = { ...topicToUpdate, title, hashtags, description };

    return allTopics.map((currentTopic) => {
      if (currentTopic.id === topic.id) {
        return updatedTopic;
      } else {
        return currentTopic;
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
        return currentTopic;
      }
    });
  };

  const handleManuallyUpdateEffectiveTimeOfStudy = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setUserUpdatedEffectiveTimeOfStudy(e.target.value);
  };

  const handleManuallyUpdateEffectiveTimeOfStudyingBlur = () => {
    const effectiveTimeOfStudy = timeStringToMillis(
      userUpdatedEffectiveTimeOfStudy
    );
    setComponentTimeState((prevValue) => ({
      ...prevValue,
      effectiveTimeOfStudy,
    }));
  };

  const handleNewTopic = () => {
    setSessionTopics((prevValue: Topic[]) => [...prevValue, createNewTopic()]);
  };

  const handleDeleteTopic = () => {
    setSessionTopics((prevValue: Topic[]) =>
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
            name="title"
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
        {isUpdate ? (
          <Input
            className="max-w-[100px] h-[36px]"
            value={userUpdatedEffectiveTimeOfStudy}
            onChange={(e) => handleManuallyUpdateEffectiveTimeOfStudy(e)}
            onBlur={handleManuallyUpdateEffectiveTimeOfStudyingBlur}
          />
        ) : (
          <BtnTimer
            size="sm"
            disabled={status === "stop" || sessionStatus !== "play"}
            status={componentTimeState.status}
            effectiveTimeOfStudy={componentTimeState.effectiveTimeOfStudy}
            onClick={() =>
              handleState(componentTimeState.status, setComponentTimeState)
            }
          />
        )}
      </div>
    </>
  );
};

export default CustomEditorForm;
