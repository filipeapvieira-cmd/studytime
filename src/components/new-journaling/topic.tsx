import React, { ChangeEvent, useEffect, useState } from "react";
import BtnTimer from "../ui/BtnTimer";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Timer, Topic, TopicTimer } from "@/src/types";
import useSessionStatus from "@/src/hooks/useSessionStatus";
import { SessionStatusEnum } from "@/src/constants/config";
import {
  forceSessionStatusOnTopicStatus,
  updateTimerStatus,
} from "@/src/lib/time-provider/utils";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import useEffectStatusHandling from "@/src/hooks/useEffectStatusHandling";
import { cn } from "@/src/lib/utils";
import ReactInputMask from "react-input-mask";
import { useUpdateSessionContext } from "@/src/ctx/update-session-provider";
import {
  calculateEffectiveTime,
  calculateTotalEffectiveTimeOfOtherTopics,
  convertMillisecondsToTimeString,
  convertTimeStringToMilliseconds,
} from "@/src/lib/session-log/update-utils";

type TopicComponentProps = {
  topic: Topic;
  selectedTopicId: string | number | null;
  setSelectedTopicId: (id: string | number | null) => void;
  deleteTopic: (id: string | number) => void;
};

type CurrentTopic = {
  title: string;
  hashtags: string;
  description: string;
};

export default function TopicComponent({
  topic,
  selectedTopicId,
  setSelectedTopicId,
  deleteTopic,
}: TopicComponentProps) {
  const {
    title,
    hashtags = "",
    description = "",
    effectiveTimeOfStudy,
    status,
    startTime,
    endTime,
    pauseStartTime,
    pauseEndTime,
    totalPauseTime,
  } = topic;

  const { setSessionTopics, isUpdate } = useFeelingsAndTopics();
  const {
    sessionToEdit: currentSession,
    sessionTopicsUpdate,
    error,
    setError,
  } = useUpdateSessionContext();
  const sessionStatus = useSessionStatus();

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

  const updateTopicTimer = (
    updateFunction: (prev: TopicTimer) => TopicTimer
  ) => {
    setTopicTimer((prev) => updateFunction(prev));
  };

  useEffectStatusHandling(topicTimer.status, updateTopicTimer);

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

  return (
    <div
      key={topic.id}
      className={cn(
        `flex flex-col p-3 rounded-xl cursor-pointer w-[232px] transition-all duration-200 ease-in-out border border-zinc-800/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]`,
        selectedTopicId === topic.id
          ? "bg-zinc-800 border-zinc-700"
          : "bg-zinc-900/50 hover:bg-zinc-800/50"
      )}
      onClick={() => setSelectedTopicId(topic.id)}
    >
      <div className="flex items-center justify-between mb-3 w-full min-w-0">
        <span className="text-zinc-200 font-medium truncate min-w-0 flex-1">
          {topic.title || "Untitled"}
        </span>
      </div>
      <div
        className={cn(
          "flex items-center gap-2 w-full",
          isUpdate && "space-between"
        )}
      >
        {isUpdate ? (
          <ReactInputMask
            value={userUpdatedEffectiveTimeOfStudy}
            mask="99:99:99"
            placeholder="HH:MM:SS"
            alwaysShowMask
            onChange={(e) => handleManuallyUpdateEffectiveTimeOfStudy(e)}
            defaultValue="00:00:00"
            className="h-[36px] flex w-full rounded-md border border-input bg-zinc-700 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
          />
        ) : (
          <BtnTimer
            size="sm"
            disabled={topic.status === "stop" || sessionStatus !== "play"}
            status={topicTimer.status as SessionStatusEnum}
            effectiveTimeOfStudy={topicTimer.effectiveTimeOfStudy}
            onClick={() => updateTimerStatus(topicTimer.status, setTopicTimer)}
            className={cn(
              `h-8 px-3 py-2 text-xs truncate flex-grow shadow-lg`,
              selectedTopicId === topic.id
                ? "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            )}
          />
        )}

        <Button
          variant="secondary"
          size="icon"
          className={cn(
            `h-8 w-8 shadow-lg flex-shrink-0`,
            selectedTopicId === topic.id
              ? "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          )}
          onClick={(e) => {
            e.stopPropagation();
            deleteTopic(topic.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
