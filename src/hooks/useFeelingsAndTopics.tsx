import { FC, useContext } from "react";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { TopicFormatted, studySessionDto } from "@/types";
import { set } from "date-fns";

// Used to differentiate between New Session or Edit Session
// Uses different ctx state depending on the option chosen

interface useFeelingsAndTopicsProps {
  action?: "update";
  studySessionToUpdate?: studySessionDto;
}

const useFeelingsAndTopics = ({
  action,
  studySessionToUpdate,
}: useFeelingsAndTopicsProps) => {
  const feelingsCtx = useContext(FeelingsContext);
  const topicsCtx = useContext(TopicsContext);

  const shouldUpdate = action && studySessionToUpdate;

  const sessionTopics = shouldUpdate
    ? topicsCtx.sessionTopicsUpdate
    : topicsCtx.sessionTopics;

  const setSessionTopics = shouldUpdate
    ? topicsCtx.setSessionTopicsUpdate
    : topicsCtx.setSessionTopics;

  const sessionFeelings = shouldUpdate
    ? feelingsCtx.sessionFeelingsUpdate
    : feelingsCtx.sessionFeelings;

  const setSessionFeelings = shouldUpdate
    ? feelingsCtx.setSessionFeelingsUpdate
    : feelingsCtx.setSessionFeelings;

  if (shouldUpdate) {
    setSessionTopics(studySessionToUpdate.topics);
    setSessionFeelings(studySessionToUpdate.feelings || "");
  }

  return {
    sessionFeelings,
    setSessionFeelings,
    sessionTopics,
    setSessionTopics,
  };
};
// ADD an optional id field to the TopicFormatted type
// fetch that field from the db on api\session\get\sessions\route.ts
// continue the convertion below
const convertTopicFormattedToTopic = (topic: TopicFormatted) => {
  const convertedTopic = {
    ...topic,
  };
};

export default useFeelingsAndTopics;
