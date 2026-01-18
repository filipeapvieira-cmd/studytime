import { SessionStatusEnum } from "@/src/constants/config";
import type { SessionStatus, Timer, TopicTimer } from "@/src/types";

export const handlePause = (
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  updateTimer((prevTimer) => {
    const isFirstPause = prevTimer.pauseStartTime === 0;
    if (isFirstPause) {
      return {
        ...prevTimer,
        pauseStartTime: Date.now(),
      };
    }
    return prevTimer;
  });
};

export const handleStop = (
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  handleIfSessionIsPaused(updateTimer);

  updateTimer((prevTimer) => ({
    //console.log(prevTimer.effectiveTimeOfStudy);
    //console.log(Date.now() - (prevTimer.startTime + prevTimer.totalPauseTime));
    ...prevTimer,
    endTime: Date.now(),
  }));
};

export const handlePlay = (
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  handleIfStartOfSession(updateTimer);
  handleIfSessionIsPaused(updateTimer);
};

export const handleEffectiveTimeOfStudyIncrease = (
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  updateTimer((prevTimer) => {
    const isSessionInPlay = prevTimer.status === SessionStatusEnum.Play;
    const effectiveTimeOfStudy = getEffectiveTimeOfStudy(
      prevTimer.startTime,
      prevTimer.totalPauseTime,
    );
    if (isSessionInPlay) {
      return {
        ...prevTimer,
        effectiveTimeOfStudy,
      };
    }
    return prevTimer;
  });
};

export const getEffectiveTimeOfStudy = (
  startTime: number,
  totalPauseTime: number,
) => {
  return Date.now() - (startTime + totalPauseTime);
};

const handleIfSessionIsPaused = (
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  updateTimer((prevTimer) => {
    const isSessionPaused = prevTimer.pauseStartTime !== 0;
    const totalPauseTime =
      prevTimer.totalPauseTime + (Date.now() - prevTimer.pauseStartTime);
    if (isSessionPaused) {
      return {
        ...prevTimer,
        totalPauseTime,
        pauseStartTime: 0,
      };
    }
    return prevTimer;
  });
};

const handleIfStartOfSession = (
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  updateTimer((prevTimer) => {
    const isStartOfSession = prevTimer.startTime === 0;
    if (isStartOfSession) {
      return {
        ...prevTimer,
        startTime: Date.now(),
      };
    }
    return prevTimer;
  });
};

const TimerStatusTransitionMap: Record<SessionStatusEnum, SessionStatusEnum> = {
  [SessionStatusEnum.Initial]: SessionStatusEnum.Play,
  [SessionStatusEnum.Play]: SessionStatusEnum.Pause,
  [SessionStatusEnum.Pause]: SessionStatusEnum.Play,
  [SessionStatusEnum.Stop]: SessionStatusEnum.Stop,
};

// Can update Session and Topic Timer status
export const updateTimerStatus = (
  status: SessionStatus,
  updateTimer: (updateFunction: (prev: Timer) => Timer) => void,
) => {
  const nextStatus = TimerStatusTransitionMap[status];

  if (nextStatus) {
    updateTimer((prevState) => ({ ...prevState, status: nextStatus }));
  } else {
    throw new Error("Invalid Session Timer Status transition.");
  }
};

export const statusToUpdateHandlerMap: Record<
  SessionStatusEnum,
  (updateTimer: (updateFunction: (prev: Timer) => Timer) => void) => void
> = {
  [SessionStatusEnum.Initial]: () => {},
  [SessionStatusEnum.Pause]: handlePause,
  [SessionStatusEnum.Stop]: handleStop,
  [SessionStatusEnum.Play]: handlePlay,
};

export const forceSessionStatusOnTopicStatus = (
  sessionStatus: SessionStatus,
  topicStatus: SessionStatus,
  updateTopicTimer: (updateFunction: (prev: TopicTimer) => TopicTimer) => void,
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
