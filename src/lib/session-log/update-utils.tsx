import type { MutableRefObject } from "react";
import { Icons } from "@/src/components/icons";
import type { FullSessionLogUpdate, Topic } from "@/src/types";
import { getFullSessionLog } from "./utils";

/**
 * Converts a time string and date string into a Unix timestamp.
 * Handles time strings with or without seconds (e.g., "19:14" or "19:14:00").
 *
 * @param sessionTime - The time string in "HH:MM" or "HH:MM:SS" format.
 * @param sessionDate - The date string in "YYYY-MM-DD" format.
 * @returns The Unix timestamp in milliseconds.
 */
export const convertTimeStringToDate = (
  sessionTime: string,
  sessionDate: string,
): number => {
  const [year, month, day] = sessionDate.split("-").map(Number);

  const timeParts = sessionTime.split(":").map(Number);
  const [hours, minutes, seconds = 0] = timeParts;

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds)
  ) {
    throw new Error("Invalid date or time format.");
  }

  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  return date.getTime();
};

/**
 * Converts a pause duration string into milliseconds.
 * Handles duration strings with or without seconds (e.g., "19:14" or "19:14:00").
 *
 * @param pauseDuration - The duration string in "HH:MM" or "HH:MM:SS" format.
 * @returns The total duration in milliseconds.
 */
export const convertTimeStringToMilliseconds = (
  pauseDuration: string,
): number => {
  const durationParts = pauseDuration.split(":").map(Number);
  const [hours, minutes, seconds = 0] = durationParts;

  /*   if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error("Invalid duration format.");
  } */

  const totalMilliseconds =
    hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

  return totalMilliseconds;
};

export const convertMillisecondsToTimeString = (
  milliseconds: number,
): string => {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

  const pad = (num: number): string => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const getSaveBtnIcon = (
  isLoading: boolean,
  actionType: MutableRefObject<string>,
) => {
  if (isLoading && actionType.current === "update") {
    return <Icons.loading className="h-6 w-6 animate-spin" />;
  }
  return <Icons.save />;
};

export const getDeleteBtnIcon = (
  isLoading: boolean,
  actionType: MutableRefObject<string>,
) => {
  if (isLoading && actionType.current === "delete") {
    return <Icons.loading className="h-6 w-6 animate-spin" />;
  }
  return <Icons.close />;
};

export const convertSessionTimeFromString = ({
  date,
  startTime,
  endTime,
  pauseDuration,
}: {
  date: string;
  startTime: string;
  endTime: string;
  pauseDuration: string;
}): {
  startTime: number;
  endTime: number;
  totalPauseTime: number;
} => {
  const sessionTime = {
    startTime: convertTimeStringToDate(startTime, date),
    endTime: convertTimeStringToDate(endTime, date),
    totalPauseTime: convertTimeStringToMilliseconds(pauseDuration),
  };

  return sessionTime;
};

export const getRequestBody = ({
  id,
  sessionFeelings,
  sessionTopics,
  date,
  startTime,
  endTime,
  pauseDuration,
  consentEnabled,
}: {
  id: number;
  sessionFeelings: string;
  sessionTopics: Topic[];
  date: string;
  startTime: string;
  endTime: string;
  pauseDuration: string;
  consentEnabled: boolean;
}) => {
  const sessionLog: FullSessionLogUpdate = {
    ...getFullSessionLog({
      sessionFeelings,
      sessionTopics,
      sessionTime: convertSessionTimeFromString({
        date,
        startTime,
        endTime,
        pauseDuration,
      }),
      consentEnabled,
    }),
    id,
  };
  return sessionLog;
};

/**
 * Calculate total study time for the session
 */
export const calculateEffectiveTime = ({
  startTime,
  endTime,
  pauseDuration,
}: {
  startTime: string;
  endTime: string;
  pauseDuration: string;
}) => {
  const startTimeMs = convertTimeStringToMilliseconds(startTime);
  const endTimeMs = convertTimeStringToMilliseconds(endTime);
  const pauseDurationMs = convertTimeStringToMilliseconds(pauseDuration);

  const effectiveTime = endTimeMs - (startTimeMs + pauseDurationMs);

  return convertMillisecondsToTimeString(effectiveTime);
};

/**
 * Sum the effective time of study from all topics except the current one
 */
export const calculateTotalEffectiveTimeOfOtherTopics = (
  topics: Topic[],
  currentTopicId: number | string,
) => {
  const totalCombinedOtherTopicTime = topics
    .filter((topicInSession) => topicInSession.id !== currentTopicId)
    .reduce((sum, topicItem) => sum + topicItem.effectiveTimeOfStudy, 0);
  return totalCombinedOtherTopicTime;
};

export const validateEffectiveTime = (effectiveTime: string) => {
  const effectiveTimeMs = convertTimeStringToMilliseconds(effectiveTime);
  if (effectiveTimeMs < 1000) {
    return false;
  }
  return true;
};

export const validatePauseDuration = (pauseDuration: string): boolean => {
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
  return timeRegex.test(pauseDuration);
};

export const validateStudySession = ({
  startTime,
  endTime,
  pauseDuration,
  sessionTopics,
}: {
  startTime: string;
  endTime: string;
  pauseDuration: string;
  sessionTopics: Topic[];
}) => {
  const sessionEffectiveTime = calculateEffectiveTime({
    startTime,
    endTime,
    pauseDuration,
  });
  if (!validateEffectiveTime(sessionEffectiveTime)) {
    return {
      error:
        "Invalid time fields provided. Please check start time, end time, and pause duration.",
    };
  }

  const topicsEffectiveTime = sessionTopics.reduce(
    (sum, topic) => sum + topic.effectiveTimeOfStudy,
    0,
  );

  const sessionEffectiveTimeMs =
    convertTimeStringToMilliseconds(sessionEffectiveTime);
  const topicsTimeFormatted =
    convertMillisecondsToTimeString(topicsEffectiveTime);

  if (topicsEffectiveTime > sessionEffectiveTimeMs) {
    return {
      error: `The total duration of the study session is ${sessionEffectiveTime}, but the combined duration of all topics is ${topicsTimeFormatted}.`,
    };
  }

  return { error: null };
};

export const isEndTimeEarlierThanStartTime = (
  endTime: string,
  startTime: string,
) => {
  const endTimeMs = convertTimeStringToMilliseconds(endTime);
  const startTimeMs = convertTimeStringToMilliseconds(startTime);

  return endTimeMs < startTimeMs;
};
