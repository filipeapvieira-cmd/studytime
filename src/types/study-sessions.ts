import { studySessionDto } from ".";

export type StudySessionsResponse = {
  status: "error" | "success";
  message: string;
  data: studySessionDto[];
};

export type MonthlyTotals = {
  [yearMonth: string]: number; // e.g., '2023-01': 3
};
