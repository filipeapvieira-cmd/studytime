import { z } from "zod";

const TopicFormattedSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  title: z.string(),
  hashtags: z.string().optional(),
  description: z.string().optional(),
  effectiveTimeOfStudy: z.number(),
  contentJson: z.any(),
});

export const FullSessionLogSchema = z.object({
  startTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date()
  ),
  endTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date()
  ),
  pauseDuration: z.number(),
  feelingDescription: z.string().optional(),
  topics: z
    .array(TopicFormattedSchema)
    .min(1, { message: "At least one topic is required" }),
});
