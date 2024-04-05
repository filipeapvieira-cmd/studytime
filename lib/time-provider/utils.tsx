import { SessionStatusEnum } from "@/constants/config";
import { SessionStatus, SessionTimer, TopicTimer } from "@/types";

export const handlePause = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  updateSessionTimer((prevSessionTimer) => {
    const isFirstPause = prevSessionTimer.sessionPauseStartTime === 0;
    if (isFirstPause) {
      return {
        ...prevSessionTimer,
        sessionPauseStartTime: Date.now(),
      };
    }
    return prevSessionTimer;
  });
};

export const handleStop = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  handleIfSessionIsPaused(updateSessionTimer);

  updateSessionTimer((prevSessionTimer) => ({
    //console.log(prevSessionTimer.effectiveTimeOfStudy);
    //console.log(Date.now() - (prevSessionTimer.sessionStartTime + prevSessionTimer.totalPauseTime));
    ...prevSessionTimer,
    sessionEndTime: Date.now(),
  }));
};

export const handlePlay = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  handleIfStartOfSession(updateSessionTimer);
  handleIfSessionIsPaused(updateSessionTimer);
};

export const handleEffectiveTimeOfStudyIncrease = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  updateSessionTimer((prevSessionTimer) => {
    const isSessionInPlay = prevSessionTimer.status === SessionStatusEnum.Play;
    const effectiveTimeOfStudy = getEffectiveTimeOfStudy(
      prevSessionTimer.sessionStartTime,
      prevSessionTimer.totalPauseTime
    );
    if (isSessionInPlay) {
      return {
        ...prevSessionTimer,
        effectiveTimeOfStudy,
      };
    }
    return prevSessionTimer;
  });
};

export const getEffectiveTimeOfStudy = (
  sessionStartTime: number,
  totalPauseTime: number
) => {
  return Date.now() - (sessionStartTime + totalPauseTime);
};

const handleIfSessionIsPaused = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  updateSessionTimer((prevSessionTimer) => {
    const isSessionPaused = prevSessionTimer.sessionPauseStartTime !== 0;
    const totalPauseTime =
      prevSessionTimer.totalPauseTime +
      (Date.now() - prevSessionTimer.sessionPauseStartTime);
    if (isSessionPaused) {
      return {
        ...prevSessionTimer,
        totalPauseTime,
        sessionPauseStartTime: 0,
      };
    }
    return prevSessionTimer;
  });
};

const handleIfStartOfSession = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  updateSessionTimer((prevSessionTimer) => {
    const isStartOfSession = prevSessionTimer.sessionStartTime === 0;
    if (isStartOfSession) {
      return {
        ...prevSessionTimer,
        sessionStartTime: Date.now(),
      };
    }
    return prevSessionTimer;
  });
};

const sessionTimerStatusTransitionMap: Record<
  SessionStatusEnum,
  SessionStatusEnum
> = {
  [SessionStatusEnum.Initial]: SessionStatusEnum.Play,
  [SessionStatusEnum.Play]: SessionStatusEnum.Pause,
  [SessionStatusEnum.Pause]: SessionStatusEnum.Play,
  [SessionStatusEnum.Stop]: SessionStatusEnum.Stop,
};

// Can update Session and Topic Timer status
export const updateTimerStatus = (
  status: SessionStatus,
  updateTimer: (updateFunction: (prev: SessionTimer) => SessionTimer) => void
) => {
  const nextStatus = sessionTimerStatusTransitionMap[status];

  if (nextStatus) {
    updateTimer((prevState) => ({ ...prevState, status: nextStatus }));
  } else {
    throw new Error("Invalid Session Timer Status transition.");
  }
};

export const sessionStatusToHandlerMap: Record<
  SessionStatusEnum,
  (
    updateSessionTimer: (
      updateFunction: (prev: SessionTimer) => SessionTimer
    ) => void
  ) => void
> = {
  [SessionStatusEnum.Initial]: () => {},
  [SessionStatusEnum.Pause]: handlePause,
  [SessionStatusEnum.Stop]: handleStop,
  [SessionStatusEnum.Play]: handlePlay,
};

export const forceSessionStatusOnTopicStatus = (
  sessionStatus: SessionStatus,
  topicStatus: SessionStatus,
  updateTopicTimer: (updateFunction: (prev: TopicTimer) => TopicTimer) => void
) => {
  if (
    sessionStatus === SessionStatusEnum.Pause &&
    topicStatus === SessionStatusEnum.Play
  ) {
    updateTimerStatus(SessionStatusEnum.Play, updateTopicTimer);
  } else if (sessionStatus === SessionStatusEnum.Stop) {
    updateTopicTimer((prevValue) => ({
      ...prevValue,
      status: SessionStatusEnum.Stop,
    }));
  } else if (sessionStatus === SessionStatusEnum.Initial) {
    updateTopicTimer((prevValue) => ({
      ...prevValue,
      status: SessionStatusEnum.Initial,
    }));
  }
};
