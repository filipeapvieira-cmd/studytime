import {
  THIS_WEEK,
  WEEK_START_DAY,
  LAST_WEEK,
  LAST_30_DAYS,
  ALL,
} from "@/src/constants/constants.charts";
import { StudySessionDto } from "@/src/types";
import { addDays, endOfWeek, startOfWeek, subWeeks } from "date-fns";

function addTimesInSeconds(time1: number, time2: string): number {
  const [hours, minutes, seconds] = time2.split(":").map(Number);
  return time1 + hours * 3600 + minutes * 60 + seconds;
}

export const getTotalStudiedTimePerDayOfTheWeek = (
  studySessions: StudySessionDto[]
) => {
  if (!studySessions || studySessions.length === 0) {
    return null;
  }

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayTimeMap: Record<string, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  studySessions.forEach((session) => {
    const day = new Date(session.date).getDay();
    const dayName = daysOfWeek[day];
    dayTimeMap[dayName] = addTimesInSeconds(
      dayTimeMap[dayName],
      session.effectiveTime
    );
  });

  const result = daysOfWeek.map((day) => ({
    name: day,
    total: dayTimeMap[day],
  }));
  return result;
};

export const getYAxisUpperBound = (
  chartData: { name: string; total: number }[] | null
) => {
  if (chartData) {
    const maxValue = Math.max(...chartData.map((item) => item.total));
    // Convert maxValue to hours
    const maxHours = maxValue / 3600;
    // Add 10% more space and round up to the next whole number
    const upperBoundHours = Math.ceil(maxHours * 1.1);
    // Convert back to seconds
    const upperBound = upperBoundHours * 3600;
    return upperBound;
  }
  return 0;
};

export const formatHSL = (hslString: string) => {
  const [hue, saturation, lightness] = hslString.split(" ");
  return `hsl(${hue}, ${saturation}, ${lightness})`;
};

export const getPredefinedDateRanges = (studySessionsDates: Date[]) => {
  const earliestDate = getEarliestDate(studySessionsDates);

  return {
    [THIS_WEEK]: {
      from: startOfWeek(new Date(), { weekStartsOn: WEEK_START_DAY }),
      to: endOfWeek(new Date(), { weekStartsOn: WEEK_START_DAY }),
    },
    [LAST_WEEK]: {
      from: startOfWeek(subWeeks(new Date(), 1), {
        weekStartsOn: WEEK_START_DAY,
      }),
      to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: WEEK_START_DAY }),
    },
    [LAST_30_DAYS]: {
      from: addDays(new Date(), -30),
      to: new Date(),
    },
    [ALL]: {
      from: earliestDate || new Date(),
      to: new Date(),
    },
  };
};

export type PredefinedDateRanges = ReturnType<typeof getPredefinedDateRanges>;
export type PredefinedDateRangeKey = keyof PredefinedDateRanges;

export const getEarliestDate = (studySessionsDates: Date[]): Date | null => {
  if (!studySessionsDates || studySessionsDates.length === 0) {
    return null;
  }

  return studySessionsDates.reduce((earliest, current) => {
    return current < earliest ? current : earliest;
  }, studySessionsDates[0]);
};

export const isEmpty = (obj: Record<string, any>): boolean =>
  Object.keys(obj).length === 0;
