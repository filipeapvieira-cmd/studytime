import { studySessionDto } from "@/src/types";
import { AcademicYearData } from "@/src/types/charts";

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
 * It calculates the academic year based on whether the date falls before or after September.
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

// Converts "YYYY-MM" to an academic year string "2022-2023", "2023-2024", etc.
export function getAcademicYear(yearMonthKey: string): string {
  const [yearStr, monthStr] = yearMonthKey.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // If month >= 9 (i.e., September–December), academic year is "YYYY-YYYY+1"
  // e.g., if it's 2023-09, it's the 2023-2024 academic year
  if (month >= 9) {
    return `${year}-${year + 1}`;
  }
  // Otherwise (January–August), academic year is "YYYY-1-YYYY"
  // e.g., if it's 2024-01, it's still the 2023-2024 academic year
  return `${year - 1}-${year}`;
}
/**
 * Groups user/community monthly totals by academic year (September-August).
 */
export function getAcademicYearData(
  userTotals: Record<string, number>,
  communityTotals: Record<string, number>
): Record<string, { month: string; user: number; community: number }[]> {
  // This will hold something like:
  // {
  //   "2023-2024": [
  //     { month: "September", user: 0, community: 0 },
  //     ...
  //   ]
  // }
  const academicYearData: Record<
    string,
    { month: string; user: number; community: number }[]
  > = {};

  // Helper: Initialize a new academic year with zeroed months
  function initAcademicYear(ay: string) {
    if (!academicYearData[ay]) {
      academicYearData[ay] = allMonths.map((m) => ({
        month: m,
        user: 0,
        community: 0,
      }));
    }
  }

  // Fill in the user data
  for (const [ym, userValue] of Object.entries(userTotals)) {
    const ay = getAcademicYear(ym); // e.g. "2023-2024"
    initAcademicYear(ay);

    // Determine which of the 12 months in allMonths this corresponds to
    // e.g., "2023-01" => "January" => find in allMonths
    const [_, mm] = ym.split("-");
    const monthIndex = parseInt(mm, 10) - 1; // JS months are 0-based
    // We have a separate array for display "January", "February", ...
    // But we want to match it to "September" -> 8, "January" -> 4, etc.
    // So let's figure out the actual month name in standard order:
    const standardMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const actualMonthName = standardMonthNames[monthIndex];

    // Now find the position in allMonths
    const targetIndex = allMonths.findIndex((m) => m === actualMonthName);
    if (targetIndex !== -1) {
      academicYearData[ay][targetIndex].user = userValue;
    }
  }

  // Fill in the community data
  for (const [ym, communityValue] of Object.entries(communityTotals)) {
    const ay = getAcademicYear(ym);
    initAcademicYear(ay);

    const [_, mm] = ym.split("-");
    const monthIndex = parseInt(mm, 10) - 1;
    const standardMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const actualMonthName = standardMonthNames[monthIndex];

    const targetIndex = allMonths.findIndex((m) => m === actualMonthName);
    if (targetIndex !== -1) {
      academicYearData[ay][targetIndex].community = communityValue;
    }
  }

  return academicYearData;
}
/**
 * Organizes study sessions into an object grouped by academic years,
 * with the total effective study time (in hours) for each month
 * within the academic year. The academic year runs from September to August.
 *
 * @param sessions - An array of study session objects. Each session contains:
 *   - `date` (string): The date of the study session.
 *   - `effectiveTime` (string): Total effective study time in the format "HH:MM".
 *
 * @returns An object where each key is an academic year label (e.g., "24/25"),
 * and the value is another object mapping month names (e.g., "September", "October")
 * to the total hours studied in that month.
 */
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
    const hours = parseEffectiveTimeToHours(session.effectiveTime);
    result[yearLabel][monthName] += hours;
  }

  return result;
}

/**
 * Determines the name of a month within the academic calendar
 * (starting in September) based on its zero-based index.
 *
 * @param monthIndex - A zero-based index of the month (0 = January, 11 = December).
 *
 * @returns The name of the corresponding month in the academic calendar.
 */
function getMonthName(monthIndex: number): string {
  const adjustedIndex =
    (monthIndex >= 8 ? monthIndex - 8 : monthIndex + 4) % 12;
  return allMonths[adjustedIndex];
}
