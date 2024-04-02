import { SessionStatusEnum } from "@/constants/config";
import { SessionStatus, SessionTimer } from "@/types";
import { Dispatch, SetStateAction } from "react";

export const handleInitial = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  return;
};

export const handlePause = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  if (sessionTimer.sessionPauseStartTime === 0) {
    setSessionTimer({
      ...sessionTimer,
      sessionPauseStartTime: Date.now(),
    });
  }
};

export const handleStop = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  handleIfSessionIsPaused(sessionTimer, setSessionTimer);
  setSessionTimer((prevSessionTimer) => {
    //console.log(prevSessionTimer.effectiveTimeOfStudy);
    //console.log(Date.now() - (prevSessionTimer.sessionStartTime + prevSessionTimer.totalPauseTime));
    return {
      ...prevSessionTimer,
      sessionEndTime: Date.now(),
    };
  });
};

export const handlePlay = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  handleIfStartOfSession(sessionTimer, setSessionTimer);
  handleIfSessionIsPaused(sessionTimer, setSessionTimer);
};

export const handleInterval = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  if (sessionTimer.status === "play") {
    setSessionTimer((prevSessionTimer) => ({
      ...prevSessionTimer,
      /*       
      EDITED on 25/07. Replaced by function
      effectiveTimeOfStudy:
        Date.now() -
        (prevSessionTimer.sessionStartTime + prevSessionTimer.totalPauseTime), */
      effectiveTimeOfStudy: getEffectiveTimeOfStudy(
        prevSessionTimer.sessionStartTime,
        prevSessionTimer.totalPauseTime
      ),
    }));
  }
};

export const getEffectiveTimeOfStudy = (
  sessionStartTime: number,
  totalPauseTime: number
) => {
  return Date.now() - (sessionStartTime + totalPauseTime);
};

const handleIfSessionIsPaused = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  if (sessionTimer.sessionPauseStartTime !== 0) {
    setSessionTimer((prevSessionTimer) => ({
      ...prevSessionTimer,
      totalPauseTime:
        prevSessionTimer.totalPauseTime +
        (Date.now() - prevSessionTimer.sessionPauseStartTime),
      sessionPauseStartTime: 0,
    }));
  }
};

const handleIfStartOfSession = (
  sessionTimer: SessionTimer,
  setSessionTimer: Dispatch<SetStateAction<SessionTimer>>
) => {
  if (sessionTimer.sessionStartTime === 0) {
    setSessionTimer((prevSessionTimer) => ({
      ...prevSessionTimer,
      sessionStartTime: Date.now(),
    }));
  }
};

export const updateSessionTimerStatus = (
  status: SessionStatus,
  cbFn: (updateFunction: (prev: SessionTimer) => SessionTimer) => void
) => {
  if (status === SessionStatusEnum.Initial) {
    cbFn((prevState) => ({ ...prevState, status: SessionStatusEnum.Play }));
  } else if (status === SessionStatusEnum.Play) {
    cbFn((prevState) => ({ ...prevState, status: SessionStatusEnum.Pause }));
  } else if (status === SessionStatusEnum.Pause) {
    cbFn((prevState) => ({ ...prevState, status: SessionStatusEnum.Play }));
  }
};

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
