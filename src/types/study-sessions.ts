import { StudySessionDto } from ".";

export type StudySessionsResponse = {
  status: "error" | "success";
  message: string;
  data: StudySessionDto[];
};

export type MonthlyTotals = {
  [yearMonth: string]: number; // e.g., '2023-01': 3
};
