import { studySessionDto } from "@/src/types";

export type MonthlyHoursMap = Record<string, number>;

export interface AcademicYearData {
  [academicYearLabel: string]: MonthlyHoursMap;
}

export type ChartItem = {
  name: string;
  total: number;
};

const allMonths = [
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
];

/**
 * Converts a time string "HH:MM:SS" into total hours (float).
 * E.g. "01:30:00" -> 1.5
 */
export function parseEffectiveTimeToHours(effectiveTimeStr: string): number {
  const [hh, mm, ss] = effectiveTimeStr
    .split(":")
    .map((val) => parseInt(val, 10));
  return hh + mm / 60 + ss / 3600;
}

/**
 * Returns a string label (e.g. "24/25") indicating the academic year.
 * Academic year: September (>= 8) of year Y -> August of year Y+1
 */
export function getAcademicYearLabel(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();

  // If it's September (8) or later, the academic year label starts in that year
  if (month >= 8) {
    // e.g. 2024 -> "24/25"
    const start = year % 100; // e.g. 24
    const end = (year + 1) % 100; // e.g. 25
    return `${start.toString().padStart(2, "0")}/${end
      .toString()
      .padStart(2, "0")}`;
  } else {
    // If month < 8, it belongs to the previous year’s start
    // e.g. date in Jan 2025 => academic year is 2024/2025 => "24/25"
    const start = (year - 1) % 100;
    const end = year % 100;
    return `${start.toString().padStart(2, "0")}/${end
      .toString()
      .padStart(2, "0")}`;
  }
}

export function groupSessionsByAcademicYear(
  sessions: studySessionDto[]
): AcademicYearData {
  const result: AcademicYearData = {};

  for (const session of sessions) {
    // Convert date string to a Date object
    const dateObj = new Date(session.date);
    const yearLabel = getAcademicYearLabel(dateObj);
    const monthIndex = dateObj.getMonth();
    const monthName = getMonthName(monthIndex);

    // Initialize the yearLabel if not present with all months set to 0
    if (!result[yearLabel]) {
      result[yearLabel] = {};
      for (const month of allMonths) {
        result[yearLabel][month] = 0;
      }
    }

    // Parse the effectiveTime for the session and add to the monthly total
    console.log(session.effectiveTime);
    console.log(parseEffectiveTimeToHours(session.effectiveTime));
    const hours = parseEffectiveTimeToHours(session.effectiveTime);
    result[yearLabel][monthName] += hours;
  }
  console.log(result);
  return result;
}

function getMonthName(monthIndex: number): string {
  // Adjust the index to match the allMonths array starting from September
  // September is month 8 in JavaScript Date
  const adjustedIndex =
    (monthIndex >= 8 ? monthIndex - 8 : monthIndex + 4) % 12;
  return allMonths[adjustedIndex];
}
