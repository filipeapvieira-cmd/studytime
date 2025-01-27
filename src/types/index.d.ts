/* CONTROL PANEL */

export type SessionStatus = "initial" | "play" | "pause" | "stop";

export type SessionTimer = {
  effectiveTimeOfStudy: number;
  status: SessionStatus;
  sessionStartTime: number;
  sessionEndTime: number;
  sessionPauseStartTime: number;
  sessionPauseEndTime: number;
  totalPauseTime: number;
};

export type TopicTimer = SessionTimer;

export type TimeContextType = {
  sessionTimer: SessionTimer;
  getLastSessionTimer: () => SessionTimer;
  status: SessionStatus;
  updateSessionTimer: (
    updateFunction: (prev: SessionTimer) => SessionTimer
  ) => void;
};

type SessionChrono = {
  seconds: number;
  isActive: boolean;
};

export type ChronoContextType = {
  sessionChrono: SessionChrono;
  setSessionChrono: Dispatch<SetStateAction<SessionChrono>>;
};

export type ControlText = {
  action:
    | "restartSession"
    | "stopSession"
    | "saveSession"
    | "updateSession"
    | "deleteSession";
};

export type ValidationRules = {
  [key: string]: (value: string, password?: string) => string | undefined;
};

/* AUTH */

export type FormState = {
  name?: string | undefined;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
};

export type ErrorState = {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
};

export type UserDetails = {
  name?: string;
  email: string;
  password: string;
};

/* PERSIST SESSION LOG */

export type SessionTimeAndDate = {
  date: Date;
  startTime: Date;
  endTime: Date;
  pausedTime: number;
};

/* SAVE SESSION FORM */

export type FullSessionLog = {
  startTime: Date;
  endTime: Date;
  pauseDuration: number;
  feelingDescription: string;
  topics: TopicFormatted[];
};

export type TopicFormatted = {
  id?: number | string;
  title: string;
  hashtags: string;
  description: string;
  effectiveTimeOfStudy: number;
};

export type Topic = SessionTimer & {
  id: string | number;
  title: string;
  hashtags: string;
  description: string;
  effectiveTimeOfStudy: number;
};

/* GET ALL SESSIONS */

export type studySessionDto = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  pauseDuration: string;
  effectiveTime: string;
  topics: TopicFormatted[];
  feelings?: string;
};

/* UPDATE SESSION */

export type FullSessionLogUpdate = FullSessionLog & {
  id: number;
};
