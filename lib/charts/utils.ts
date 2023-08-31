import { studySessionDto } from "@/types";

function addTimesInSeconds(time1: number, time2: string): number {
  const [hours, minutes, seconds] = time2.split(":").map(Number);
  return time1 + hours * 3600 + minutes * 60 + seconds;
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

export const getTotalStudiedTimePerDayOfTheWeek = (
  studySessions: studySessionDto[]
) => {
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
  console.log("utils");
  console.log(result);
  return result;
};
