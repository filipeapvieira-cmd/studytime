import { useContext } from "react";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { useUpdateSessionContext } from "../ctx/update-session-provider";
import { is } from "date-fns/locale";

const useFeelingsAndTopics = () => {
  const feelingsCtx = useContext(FeelingsContext);
  const topicsCtx = useContext(TopicsContext);
  const {
    sessionToEdit,
    sessionTopicsUpdate,
    setSessionTopicsUpdate,
    sessionFeelingsUpdate,
    setSessionFeelingsUpdate,
  } = useUpdateSessionContext();

  const isUpdate = !!sessionToEdit;

  const sessionTopics = isUpdate
    ? sessionTopicsUpdate
    : topicsCtx.sessionTopics;

  const setSessionTopics = isUpdate
    ? setSessionTopicsUpdate
    : topicsCtx.setSessionTopics;

  const sessionFeelings = isUpdate
    ? sessionFeelingsUpdate
    : feelingsCtx.sessionFeelings;

  const setSessionFeelings = isUpdate
    ? setSessionFeelingsUpdate
    : feelingsCtx.setSessionFeelings;

  return {
    sessionFeelings,
    setSessionFeelings,
    sessionTopics,
    setSessionTopics,
    isUpdate,
  };
};

export default useFeelingsAndTopics;
