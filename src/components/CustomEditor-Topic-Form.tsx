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
import { Topic, TopicTimer } from "@/src/types";
import {
  TopicsContext,
  createNewTopic,
} from "@/src/ctx/session-topics-provider";
import {
  updateTimerStatus,
  forceSessionStatusOnTopicStatus,
} from "@/src/lib/time-provider/utils";
import { TimeContext } from "@/src/ctx/time-provider";
import BtnTimer from "./ui/BtnTimer";
import { SessionTimer } from "@/src/types";
import useEffectStatusHandling from "@/hooks/useEffectStatusHandling";
import useSessionStatus from "@/src/hooks/useSessionStatus";
import CustomTextArea from "./ui/CustomTextArea";
import { timeStringToMillis } from "@/src/lib/session-log/update-utils";
import { TopicSelection } from "./ui/topic-selection";
import HashtagSelection from "./custom-editor/hashtag-selection";

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

  const [topicTimer, setTopicTimer] = useState<TopicTimer>({
    effectiveTimeOfStudy,
    status,
    sessionStartTime,
    sessionEndTime,
    sessionPauseStartTime,
    sessionPauseEndTime,
    totalPauseTime,
  });

  const updateTopicTimer = (
    updateFunction: (prev: TopicTimer) => TopicTimer
  ) => {
    setTopicTimer((prev) => updateFunction(prev));
  };

  const [userUpdatedEffectiveTimeOfStudy, setUserUpdatedEffectiveTimeOfStudy] =
    useState(
      String(
        new Date(topicTimer.effectiveTimeOfStudy).toISOString().slice(11, 19)
      )
    );

  useEffect(() => {
    forceSessionStatusOnTopicStatus(
      sessionStatus,
      topicTimer.status,
      updateTopicTimer
    );
  }, [sessionStatus]);

  useEffect(() => {
    setSessionTopics((prevValue: Topic[]) =>
      handleTimerChange(prevValue, topicTimer)
    );
  }, [topicTimer]);

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
    setTopicTimer((prevValue) => ({
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

  const handleOnTopicSelection = (topic: string) => {
    setCurrentTopic((prevValue) => ({
      ...prevValue,
      title: topic,
    }));
  };

  const handleOnHashtagSelection = (hashtags: string) => {
    setCurrentTopic((prevValue) => ({
      ...prevValue,
      hashtags,
    }));
  };

  useEffectStatusHandling(topicTimer.status, updateTopicTimer);
  return (
    <>
      <form className="pb-2">
        <div className="flex">
          <TopicSelection
            currentTopic={currentTopic.title}
            onTopicSelection={handleOnTopicSelection}
          />
          <HashtagSelection
            currentHashtags={currentTopic.hashtags}
            onHashtagSelection={handleOnHashtagSelection}
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
            status={topicTimer.status}
            effectiveTimeOfStudy={topicTimer.effectiveTimeOfStudy}
            onClick={() => updateTimerStatus(topicTimer.status, setTopicTimer)}
          />
        )}
      </div>
    </>
  );
};

export default CustomEditorForm;
