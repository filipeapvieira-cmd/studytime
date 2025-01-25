import { MonthlyTotals } from "../types/study-sessions";

/**
 * Utility to get a Year-Month key like '2025-01'
 */
export function getYearMonthString(date: Date): string {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

/**
 * Utility to format milliseconds into HH:mm:ss
 */
export function msToHHMMSS(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

/**
 * Calculates the effective time of a session in milliseconds.
 *
 * The effective time is the total session duration minus any pause duration.
 *
 * @returns The effective session time in milliseconds.
 */
export function calculateEffectiveTimeMs(
  startTime: Date,
  endTime: Date,
  pauseDuration: number
): number {
  return endTime.getTime() - (startTime.getTime() + pauseDuration);
}

/**
 * Utility: sum up effective times into { [yearMonth]: totalMs }
 * Optionally we track user IDs or do other grouping as needed.
 */
export function accumulateMonthlyEffectiveTimes(
  sessions: any[]
): Record<string, number> {
  const monthlyTotals: Record<string, number> = {};

  for (const session of sessions) {
    const { startTime, endTime, pauseDuration } = session;
    const effectiveTimeMs = calculateEffectiveTimeMs(
      startTime,
      endTime,
      pauseDuration
    );
    const ym = getYearMonthString(startTime);

    if (!monthlyTotals[ym]) {
      monthlyTotals[ym] = 0;
    }
    monthlyTotals[ym] += effectiveTimeMs;
  }

  return monthlyTotals;
}

export const convertMsMonthlyTotalsToHours = (
  monthlyTotalsMs: Record<string, number>
): Record<string, number> => {
  const userMonthlyTotals: Record<string, number> = {};
  for (const [ym, ms] of Object.entries(monthlyTotalsMs)) {
    userMonthlyTotals[ym] = convertMsToHours(ms);
  }
  return userMonthlyTotals;
};

/**
 * Convert milliseconds to hours and round down to the nearest integer
 */
function convertMsToHours(ms: number): number {
  return Math.round(ms / (1000 * 60 * 60));
}
