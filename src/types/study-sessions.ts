import { studySessionDto } from ".";

export type StudySessionsResponse = {
  status: "error" | "success";
  message: string;
  data: studySessionDto[];
};
