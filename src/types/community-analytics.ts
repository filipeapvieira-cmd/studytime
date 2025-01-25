import { MonthlyTotals } from "./study-sessions";

export type CommunityData =
  | {
      userMonthlyTotals: MonthlyTotals;
      communityMonthlyTotals: MonthlyTotals;
    }
  | {};
