"use client";

import {
  FC,
  ChangeEvent,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Button } from "./ui/button";
import { Topic, TopicTimer } from "@/src/types";
import { createNewTopic } from "@/src/ctx/session-topics-provider";
import {
  updateTimerStatus,
  forceSessionStatusOnTopicStatus,
} from "@/src/lib/time-provider/utils";
import BtnTimer from "./ui/BtnTimer";
import { Timer } from "@/src/types";
import useEffectStatusHandling from "@/hooks/useEffectStatusHandling";
import useSessionStatus from "@/src/hooks/useSessionStatus";
import CustomTextArea from "./ui/CustomTextArea";
import {
  calculateEffectiveTime,
  calculateTotalEffectiveTimeOfOtherTopics,
  convertMillisecondsToTimeString,
  convertTimeStringToMilliseconds,
} from "@/src/lib/session-log/update-utils";
import { TopicSelection } from "./ui/topic-selection";
import HashtagSelection from "./custom-editor/hashtag-selection";
import ReactInputMask from "react-input-mask";
import { useUpdateSessionContext } from "../ctx/update-session-provider";
import { SessionStatusEnum } from "../constants/config";

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
  const {
    sessionToEdit: currentSession,
    sessionTopicsUpdate,
    error,
    setError,
  } = useUpdateSessionContext();
  const sessionStatus = useSessionStatus();

  const {
    title,
    hashtags,
    description,
    effectiveTimeOfStudy,
    status,
    startTime,
    endTime,
    pauseStartTime,
    pauseEndTime,
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
    startTime,
    endTime,
    pauseStartTime,
    pauseEndTime,
    totalPauseTime,
  });

  const [userUpdatedEffectiveTimeOfStudy, setUserUpdatedEffectiveTimeOfStudy] =
    useState(convertMillisecondsToTimeString(topicTimer.effectiveTimeOfStudy));

  const updateTopicTimer = (
    updateFunction: (prev: TopicTimer) => TopicTimer
  ) => {
    setTopicTimer((prev) => updateFunction(prev));
  };

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

  const handleTimerChange = (allTopics: Topic[], componentTimeState: Timer) => {
    const topicToUpdate: Topic = allTopics.find(
      (currentTopic) => currentTopic.id === topic.id
    ) as Topic;

    const {
      effectiveTimeOfStudy,
      status,
      startTime,
      endTime,
      pauseStartTime,
      pauseEndTime,
      totalPauseTime,
    } = componentTimeState;

    const updatedTopic = {
      ...topicToUpdate,
      effectiveTimeOfStudy,
      status,
      startTime,
      endTime,
      pauseStartTime,
      pauseEndTime,
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
    const newValue = e.target.value;
    setUserUpdatedEffectiveTimeOfStudy(newValue);

    if (!currentSession) return;

    const { startTime, endTime, pauseDuration, topics } = currentSession;
    const totalStudySessionTime = calculateEffectiveTime({
      startTime,
      endTime,
      pauseDuration,
    });
    const totalStudySessionTimeMs = convertTimeStringToMilliseconds(
      totalStudySessionTime
    );

    const totalEffectiveTimeOfOtherTopics =
      calculateTotalEffectiveTimeOfOtherTopics(sessionTopicsUpdate, topic.id);

    const possibleModification =
      totalStudySessionTimeMs - totalEffectiveTimeOfOtherTopics;

    const manuallyEditedEffectiveTimeOfStudy =
      convertTimeStringToMilliseconds(newValue);

    setTopicTimer((prevValue) => ({
      ...prevValue,
      effectiveTimeOfStudy: manuallyEditedEffectiveTimeOfStudy,
    }));

    if (manuallyEditedEffectiveTimeOfStudy <= possibleModification) {
      setError((prev) => ({ ...prev, effectiveTime: false }));
    } else {
      setError((prev) => ({ ...prev, effectiveTime: true }));
    }
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
          className="rounded-t-none"
        />
      </form>
      <div className="flex gap-x-1 p-2">
        <Button onClick={handleNewTopic} size="sm">
          New Topic
        </Button>
        <Button onClick={handleDeleteTopic} variant="destructive" size="sm">
          Delete
        </Button>
        {isUpdate ? (
          <ReactInputMask
            value={userUpdatedEffectiveTimeOfStudy}
            mask="99:99:99"
            placeholder="HH:MM:SS"
            alwaysShowMask
            onChange={(e) => handleManuallyUpdateEffectiveTimeOfStudy(e)}
            defaultValue="00:00:00"
            className="max-w-[100px] h-[36px] flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : (
          <BtnTimer
            size="sm"
            disabled={status === "stop" || sessionStatus !== "play"}
            status={topicTimer.status as SessionStatusEnum}
            effectiveTimeOfStudy={topicTimer.effectiveTimeOfStudy}
            onClick={() => updateTimerStatus(topicTimer.status, setTopicTimer)}
          />
        )}
      </div>
    </>
  );
};

export default CustomEditorForm;
