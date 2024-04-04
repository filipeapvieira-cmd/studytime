import { SessionStatusEnum } from "@/constants/config";
import { SessionStatus, SessionTimer } from "@/types";
import { Dispatch, SetStateAction } from "react";

export const handleInitial = (
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  return;
};

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
    if (isSessionInPlay) {
      return {
        ...prevSessionTimer,
        effectiveTimeOfStudy: getEffectiveTimeOfStudy(
          prevSessionTimer.sessionStartTime,
          prevSessionTimer.totalPauseTime
        ),
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
    if (isSessionPaused) {
      return {
        ...prevSessionTimer,
        totalPauseTime:
          prevSessionTimer.totalPauseTime +
          (Date.now() - prevSessionTimer.sessionPauseStartTime),
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

export const updateSessionTimerStatus = (
  status: SessionStatus,
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void
) => {
  const nextStatus = sessionTimerStatusTransitionMap[status];

  if (nextStatus) {
    updateSessionTimer((prevState) => ({ ...prevState, status: nextStatus }));
  } else {
    throw new Error("Invalid Session Timer Status transition.");
  }
};

//TODO: refactor to use a record
export const statusToHandler = {
  initial: handleInitial,
  pause: handlePause,
  stop: handleStop,
  play: handlePlay,
};

export const coerceComponentState = (
  parentState: SessionStatus,
  childState: SessionStatus,
  setter: Dispatch<SetStateAction<SessionTimer>>
) => {
  if (parentState === "pause" && childState === "play") {
    updateSessionTimerStatus("play", setter);
  } else if (parentState === "stop") {
    setter((prevValue) => ({ ...prevValue, status: "stop" }));
  } else if (parentState === "initial") {
    setter((prevValue) => ({ ...prevValue, status: "initial" }));
  }
};
