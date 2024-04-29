import { FC, useContext, useEffect } from "react";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { Topic, TopicFormatted, studySessionDto } from "@/src/types";
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

  const isUpdate = action && studySessionToUpdate;

  const sessionTopics = isUpdate
    ? topicsCtx.sessionTopicsUpdate
    : topicsCtx.sessionTopics;

  const setSessionTopics = isUpdate
    ? topicsCtx.setSessionTopicsUpdate
    : topicsCtx.setSessionTopics;

  const sessionFeelings = isUpdate
    ? feelingsCtx.sessionFeelingsUpdate
    : feelingsCtx.sessionFeelings;

  const setSessionFeelings = isUpdate
    ? feelingsCtx.setSessionFeelingsUpdate
    : feelingsCtx.setSessionFeelings;

  return {
    sessionFeelings,
    setSessionFeelings,
    sessionTopics,
    setSessionTopics,
  };
};

export default useFeelingsAndTopics;
