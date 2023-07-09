import { FilterMeta } from "@tanstack/react-table";

export type RankAndValue = FilterMeta & {
  value: string;
};

export type StudySession = {
  id: number;
  date: string;
  effectiveTime: string;
  content: [{ topic: string; subTopic: string; text: string }];
  feeling: string;
  endTime: string;
  startTime: string;
  pauseDuration: string;
};
